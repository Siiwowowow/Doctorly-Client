"use client"

import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllPatients, updatePatientStatus, deletePatient } from '@/services/patient.services'
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

export default function PatientsManagementPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const { data: patientsData, isLoading, isError } = useQuery({
    queryKey: ['admin-patients'],
    queryFn: () => getAllPatients(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePatient(id),
    onSuccess: () => {
      toast({ title: "Patient deleted successfully" })
      queryClient.invalidateQueries({ queryKey: ['admin-patients'] })
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Failed to delete patient", description: err.message })
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
        <p>Failed to load patients.</p>
      </div>
    )
  }

  const patients = patientsData?.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Patient Management</h2>
          <p className="text-muted-foreground">
            View and manage all registered patients on the platform.
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No patients found.
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.contactNumber || "N/A"}</TableCell>
                  <TableCell>
                    {patient.isDeleted ? (
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
                          <Link href={`/admin/patients/${patient.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </Link>
                        </DropdownMenuItem>

                        {!patient.isDeleted && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                if(confirm("Are you sure you want to delete this patient?")) {
                                  deleteMutation.mutate(patient.id)
                                }
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Patient
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
