/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect, useRef } from "react"
// removed Card imports
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/providers/AuthProvider"
import { useSocket } from "@/providers/SocketProvider"
import { getMyConversations, getConversationMessages } from "@/services/chat.services"
import { Loader2, Search, MessageSquare, CheckCircle2, Send } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

export default function ChatPage() {
  const { user } = useAuth()
  const { socket, isConnected } = useSocket()
  
  const [conversations, setConversations] = useState<any[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loadingConv, setLoadingConv] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const scrollRef = useRef<HTMLDivElement>(null)

  // Fetch initial conversations
  useEffect(() => {
    const fetchConv = async () => {
      try {
        const res = await getMyConversations()
        setConversations(res.data || [])
      } catch {
        toast.error("Failed to load conversations")
      } finally {
        setLoadingConv(false)
      }
    }
    fetchConv()
  }, [])

  // Fetch messages when conversation changes
  useEffect(() => {
    if (!activeConversationId) return

    const fetchMsgs = async () => {
      setLoadingMsgs(true)
      try {
        const res = await getConversationMessages(activeConversationId)
        setMessages(Array.isArray(res.data) ? res.data : [])
        if (socket && isConnected) {
            (socket as any).emit("chat:read", { conversationId: activeConversationId });
        }
      } catch {
        toast.error("Failed to load messages")
      } finally {
        setLoadingMsgs(false)
      }
    }
    fetchMsgs()
  }, [activeConversationId, isConnected, socket])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Listen for new incoming messages via socket
  useEffect(() => {
    if (!socket || !isConnected) return

    const handleMessage = (msg: any) => {
      if (msg.conversationId === activeConversationId && activeConversationId) {
        setMessages(prev => {
          // Prevent duplicates (especially in React StrictMode)
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        if (socket && isConnected) {
            (socket as any).emit("chat:read", { conversationId: activeConversationId });
        }
      }
      
      // Update conversation list to show latest message
      setConversations(prev => {
        const updated = prev.map(c => {
          if (c.id === msg.conversationId) {
             return { ...c, lastMessageAt: msg.createdAt, _count: { ...c._count, messages: (c._count?.messages || 0) + 1 } }
          }
          return c
        })
        // sort by newest
        return updated.sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime())
      })
    }

    const handleRead = (payload: { conversationId: string; readerId: string; readAt: string }) => {
        if (payload.conversationId === activeConversationId && payload.readerId !== user?.id) {
            setMessages(prev => prev.map(m => ({ ...m, isRead: true })));
        }
    }

    (socket as any)?.on("chat:message", handleMessage);
    (socket as any)?.on("chat:read", handleRead);

    return () => {
      (socket as any)?.off("chat:message", handleMessage);
      (socket as any)?.off("chat:read", handleRead);
    }
  }, [socket, isConnected, activeConversationId, user?.id])

  // Join and leave conversation rooms
  useEffect(() => {
    if (!socket || !isConnected || !activeConversationId) return;

    (socket as any).emit("chat:join-conversation", { conversationId: activeConversationId });

    return () => {
      (socket as any).emit("chat:leave-conversation", { conversationId: activeConversationId });
    };
  }, [socket, isConnected, activeConversationId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConversationId) return

    const conv = conversations.find(c => c.id === activeConversationId);
    const otherUserId = conv?.participants?.find((p: any) => p.userId !== user?.id)?.userId;

    if (!otherUserId) return;

    const tempId = `temp-${Date.now()}`
    const tempMsg = {
      id: tempId,
      conversationId: activeConversationId,
      senderId: user?.id,
      content: newMessage,
      createdAt: new Date().toISOString(),
      isRead: false
    }

    setMessages(prev => [...prev, tempMsg])
    setNewMessage("")

    if (socket && isConnected) {
        (socket as any).emit("chat:send", {
            recipientId: otherUserId,
            content: tempMsg.content,
            conversationId: activeConversationId,
            tempId: tempId
        }, (status: { success: boolean; error?: string }) => {
            if (!status.success) {
                toast.error("Failed to send message");
                setMessages(prev => prev.filter(m => m.id !== tempId));
            } else {
                // Update conversations list
                setConversations(prev => {
                    const updated = prev.map(c => c.id === activeConversationId ? { ...c, lastMessageAt: tempMsg.createdAt } : c)
                    return updated.sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime())
                })
            }
        });
    } else {
        toast.error("Not connected to chat server");
    }
  }

  const filteredConversations = conversations.filter(c => {
    // Determine the "other participant"
    const other = c.participants?.find((p: any) => p.userId !== user?.id)?.user
    if (!other) return false
    return other.name?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="h-[calc(100vh-140px)] flex bg-background border rounded-2xl overflow-hidden shadow-sm">
      
      {/* Sidebar: Conversations List */}
      <div className={`w-full md:w-80 lg:w-96 border-r flex-col h-full bg-muted/20 shrink-0 ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b bg-background">
          <h2 className="text-xl font-bold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-9 bg-muted/50 border-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {loadingConv ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <MessageSquare className="h-10 w-10 mx-auto opacity-20 mb-3" />
              <p className="text-sm">No conversations found.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filteredConversations.map((conv) => {
                const other = conv.participants?.find((p: any) => p.userId !== user?.id)?.user
                const isActive = activeConversationId === conv.id
                
                return (
                  <button 
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`w-full text-left p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors ${isActive ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12 border">
                        <AvatarImage src={other?.profilePhoto} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {other?.name?.substring(0, 2).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      {/* Optional online indicator */}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-sm truncate">{other?.name || 'Unknown User'}</h3>
                        <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                          {conv.lastMessageAt ? format(new Date(conv.lastMessageAt), 'MMM d, h:mm a') : ''}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground truncate">
                          {conv.type === 'GROUP' ? 'Group Chat' : 'Direct Message'}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Main Area: Chat Window */}
      <div className={`flex-1 flex-col h-full ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
        {!activeConversationId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 p-8 text-center">
            <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">Your Messages</h3>
            <p className="max-w-md">Select a conversation from the sidebar to start chatting with your doctor or patient.</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-[72px] border-b p-4 flex items-center justify-between bg-background shrink-0">
              {(() => {
                const conv = conversations.find(c => c.id === activeConversationId)
                const other = conv?.participants?.find((p: any) => p.userId !== user?.id)?.user
                
                return (
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="md:hidden mr-1" onClick={() => setActiveConversationId(null)}>
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={other?.profilePhoto} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {other?.name?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{other?.name || 'Unknown'}</h3>
                      <p className="text-xs text-muted-foreground capitalize">{other?.role?.toLowerCase() || 'User'}</p>
                    </div>
                  </div>
                )
              })()}
              
              <div className="flex items-center gap-2">
                {/* Actions like video call button if needed */}
              </div>
            </div>

            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4 bg-muted/10">
              {loadingMsgs ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-20">
                  <p className="text-sm bg-background px-4 py-2 rounded-full border shadow-sm">This is the beginning of your conversation.</p>
                </div>
              ) : (
                <div className="space-y-4 pb-4">
                  {messages.map((msg, i) => {
                    const isMe = msg.senderId === user?.id
                    return (
                      <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] sm:max-w-[65%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div 
                            className={`px-4 py-2.5 rounded-2xl ${
                              isMe 
                                ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                                : 'bg-background border shadow-sm rounded-tl-sm text-foreground'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                          </div>
                          <div className="flex items-center gap-1 mt-1 px-1">
                            <span className="text-[10px] text-muted-foreground">
                              {format(new Date(msg.createdAt), 'h:mm a')}
                            </span>
                            {isMe && msg.isRead && (
                              <CheckCircle2 className="h-3 w-3 text-blue-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={scrollRef} />
                </div>
              )}
            </ScrollArea>

            {/* Chat Input */}
            <div className="p-4 bg-background border-t shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <div className="relative flex-1">
                  <Input 
                    placeholder="Type your message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="pr-12 rounded-full bg-muted/50 border-transparent focus-visible:ring-primary/20 focus-visible:border-primary"
                  />
                </div>
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!newMessage.trim()}
                  className="rounded-full shrink-0 h-10 w-10 shadow-sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
      
    </div>
  )
}
