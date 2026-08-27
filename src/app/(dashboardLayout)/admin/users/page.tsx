"use client"

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllUsers, updateUserStatus, updateUserRole, deleteUser } from '@/services/admin.services'
import { Role, UserStatus } from '@/types/api.types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ShieldAlert, Ban, CheckCircle, Trash2 } from "lucide-react"

export default function UsersManagementPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const { data: usersData, isLoading, isError } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => getAllUsers(),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: UserStatus }) => updateUserStatus(id, status),
    onSuccess: () => {
      toast({ title: "Status updated successfully" })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Failed to update status", description: err.message })
    }
  })

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string, role: Role }) => updateUserRole(id, role),
    onSuccess: () => {
      toast({ title: "Role updated successfully" })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Failed to update role", description: err.message })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      toast({ title: "User deleted successfully" })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Failed to delete user", description: err.message })
    }
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-dashed text-muted-foreground">
        <p>Failed to load users.</p>
      </div>
    )
  }

  const users = usersData?.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            View and manage all registered users on the platform.
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.status === UserStatus.ACTIVE ? "outline" : "destructive"}
                      className={user.status === UserStatus.ACTIVE ? "border-green-500 text-green-600" : ""}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        {/* Status Actions */}
                        {user.status === UserStatus.ACTIVE ? (
                          <DropdownMenuItem onClick={() => statusMutation.mutate({ id: user.id, status: UserStatus.BLOCKED })}>
                            <Ban className="mr-2 h-4 w-4" />
                            Block User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => statusMutation.mutate({ id: user.id, status: UserStatus.ACTIVE })}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Unblock User
                          </DropdownMenuItem>
                        )}

                        {/* Role Actions */}
                        {user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN && (
                          <DropdownMenuItem onClick={() => roleMutation.mutate({ id: user.id, role: Role.ADMIN })}>
                            <ShieldAlert className="mr-2 h-4 w-4" />
                            Make Admin
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            if(confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
                              deleteMutation.mutate(user.id)
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
