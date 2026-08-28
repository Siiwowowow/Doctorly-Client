"use client"

import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllAdmins, deleteAdmin } from '@/services/admin.services'
import { getAllDoctorsAdmin, deleteDoctor } from '@/services/doctor.services'
import { getAllPatients, deletePatient } from '@/services/patient.services'
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
import { MoreHorizontal, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UsersManagementPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  // Queries
  const { data: adminsData, isLoading: isLoadingAdmins } = useQuery({
    queryKey: ['admin-admins'],
    queryFn: () => getAllAdmins(),
  })

  const { data: doctorsData, isLoading: isLoadingDoctors } = useQuery({
    queryKey: ['admin-doctors'],
    queryFn: () => getAllDoctorsAdmin(),
  })

  const { data: patientsData, isLoading: isLoadingPatients } = useQuery({
    queryKey: ['admin-patients'],
    queryFn: () => getAllPatients(),
  })

  // Mutations
  const deleteAdminMutation = useMutation({
    mutationFn: (id: string) => deleteAdmin(id),
    onSuccess: () => {
      toast({ title: "Admin deleted successfully" })
      queryClient.invalidateQueries({ queryKey: ['admin-admins'] })
    },
    onError: (err: unknown) => {
      toast({ variant: "destructive", title: "Failed to delete admin", description: err instanceof Error ? err.message : "Unknown error" })
    }
  })

  const deleteDoctorMutation = useMutation({
    mutationFn: (id: string) => deleteDoctor(id),
    onSuccess: () => {
      toast({ title: "Doctor deleted successfully" })
      queryClient.invalidateQueries({ queryKey: ['admin-doctors'] })
    },
    onError: (err: unknown) => {
      toast({ variant: "destructive", title: "Failed to delete doctor", description: err instanceof Error ? err.message : "Unknown error" })
    }
  })

  const deletePatientMutation = useMutation({
    mutationFn: (id: string) => deletePatient(id),
    onSuccess: () => {
      toast({ title: "Patient deleted successfully" })
      queryClient.invalidateQueries({ queryKey: ['admin-patients'] })
    },
    onError: (err: unknown) => {
      toast({ variant: "destructive", title: "Failed to delete patient", description: err instanceof Error ? err.message : "Unknown error" })
    }
  })

  const admins = adminsData?.data || []
  const doctors = doctorsData?.data || []
  const patients = patientsData?.data || []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderTable = (data: any[], type: 'admin' | 'doctor' | 'patient', isLoading: boolean, deleteMut: any) => {
    if (isLoading) {
      return (
        <div className="space-y-4 p-4">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      )
    }

    return (
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No {type}s found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email || user.user?.email}</TableCell>
                  <TableCell>
                    <Badge variant={type === 'admin' ? "default" : "secondary"}>
                      {type.toUpperCase()}
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
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            if(confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) {
                              deleteMut.mutate(user.id)
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete {type.charAt(0).toUpperCase() + type.slice(1)}
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
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            View and manage users partitioned by their roles. Note: User role and status updates are not supported by the current backend.
          </p>
        </div>
      </div>

      <Tabs defaultValue="admins" className="space-y-4">
        <TabsList>
          <TabsTrigger value="admins">Admins</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
        </TabsList>
        <TabsContent value="admins">
          {renderTable(admins, 'admin', isLoadingAdmins, deleteAdminMutation)}
        </TabsContent>
        <TabsContent value="doctors">
          {renderTable(doctors, 'doctor', isLoadingDoctors, deleteDoctorMutation)}
        </TabsContent>
        <TabsContent value="patients">
          {renderTable(patients, 'patient', isLoadingPatients, deletePatientMutation)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
