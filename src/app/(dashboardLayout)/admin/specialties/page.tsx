"use client"

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllSpecialties, createSpecialty, deleteSpecialty } from '@/services/specialty.services'
import { Specialty } from '@/types/api.types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
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
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoreHorizontal, Plus, Trash2 } from "lucide-react"

export default function SpecialtiesManagementPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  
  const { data: specialtiesData, isLoading, isError } = useQuery({
    queryKey: ['admin-specialties'],
    queryFn: () => getAllSpecialties(),
  })

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Specialty>) => createSpecialty(data),
    onSuccess: () => {
      toast({ title: "Specialty created successfully" })
      queryClient.invalidateQueries({ queryKey: ['admin-specialties'] })
      setIsDialogOpen(false)
      setTitle("")
      setDescription("")
    },
    onError: (err: unknown) => {
      toast({ variant: "destructive", title: "Operation failed", description: err instanceof Error ? err.message : "Unknown error" })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSpecialty(id),
    onSuccess: () => {
      toast({ title: "Specialty deleted successfully" })
      queryClient.invalidateQueries({ queryKey: ['admin-specialties'] })
    },
    onError: (err: unknown) => {
      toast({ variant: "destructive", title: "Failed to delete specialty", description: err instanceof Error ? err.message : "Unknown error" })
    }
  })

  const handleOpenDialog = () => {
    setTitle("")
    setDescription("")
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!title.trim()) return
    saveMutation.mutate({ title, description })
  }

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
        <p>Failed to load specialties.</p>
      </div>
    )
  }

  const specialties = specialtiesData?.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Specialty Management</h2>
          <p className="text-muted-foreground">
            Manage medical specialties available on the platform.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Add Specialty
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {specialties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                  No specialties found.
                </TableCell>
              </TableRow>
            ) : (
              specialties.map((specialty) => (
                <TableRow key={specialty.id}>
                  <TableCell className="font-medium">{specialty.title}</TableCell>
                  <TableCell className="text-muted-foreground">{specialty.description || "N/A"}</TableCell>
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
                        
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            if(confirm(`Are you sure you want to delete ${specialty.title}?`)) {
                              deleteMutation.mutate(specialty.id)
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Specialty</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g. Cardiology" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Brief description (optional)" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saveMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim() || saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
