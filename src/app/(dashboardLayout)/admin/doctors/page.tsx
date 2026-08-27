"use client"

import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllDoctorsAdmin, deleteDoctor } from '@/services/doctor.services'
import { Doctor, DoctorSpecialty } from '@/types/api.types'
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
import { MoreHorizontal, Eye, Trash2 } from "lucide-react"
import Link from 'next/link'

export default function DoctorsManagementPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const { data: doctorsData, isLoading, isError } = useQuery({
    queryKey: ['admin-doctors'],
    queryFn: () => getAllDoctorsAdmin(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDoctor(id),
    onSuccess: () => {
      toast({ title: "Doctor deleted successfully" })
      queryClient.invalidateQueries({ queryKey: ['admin-doctors'] })
    },
    onError: (err: unknown) => {
      toast({ variant: "destructive", title: "Failed to delete doctor", description: err instanceof Error ? err.message : "Unknown error" })
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
        <p>Failed to load doctors.</p>
      </div>
    )
  }

  const doctors: Doctor[] = doctorsData?.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Doctor Management</h2>
          <p className="text-muted-foreground">
            View and manage all doctors on the platform.
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Specialties</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No doctors found.
                </TableCell>
              </TableRow>
            ) : (
              doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell className="font-medium">{doctor.name}</TableCell>
                  <TableCell>{doctor.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {doctor.specialties?.slice(0, 2).map((s: DoctorSpecialty) => (
                        <Badge key={s.specialtyId} variant="secondary" className="text-xs">
                          {s.specialty?.title}
                        </Badge>
                      ))}
                      {doctor.specialties && doctor.specialties.length > 2 && (
                        <Badge variant="outline" className="text-xs">+{doctor.specialties.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>${doctor.appointmentFee}</TableCell>
                  <TableCell>
                    {doctor.isDeleted ? (
                      <Badge variant="destructive">Deleted</Badge>
                    ) : (
                      <Badge variant="outline" className="border-green-500 text-green-600">Active</Badge>
                    )}
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
                        
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/doctors/${doctor.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </Link>
                        </DropdownMenuItem>

                        {!doctor.isDeleted && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                if(confirm("Are you sure you want to delete this doctor?")) {
                                  deleteMutation.mutate(doctor.id)
                                }
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Doctor
                            </DropdownMenuItem>
                          </>
                        )}
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
