"use client"

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAllPrescriptionsAdmin } from '@/services/prescription.services'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"

export default function PrescriptionsManagementPage() {
  const { data: prescriptionsData, isLoading, isError } = useQuery({
    queryKey: ['admin-prescriptions'],
    queryFn: () => getAllPrescriptionsAdmin(),
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
        <p>Failed to load prescriptions.</p>
      </div>
    )
  }

  const prescriptions = prescriptionsData?.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Prescriptions</h2>
          <p className="text-muted-foreground">
            Overview of prescriptions across the platform.
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Instructions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prescriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No prescriptions found.
                </TableCell>
              </TableRow>
            ) : (
              prescriptions.map((prescription: any) => (
                <TableRow key={prescription.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {format(new Date(prescription.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{prescription.doctor?.name || "Unknown"}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{prescription.patient?.name || "Unknown"}</div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[300px] truncate" title={prescription.instructions}>
                      {prescription.instructions || "N/A"}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="bg-muted/50 border rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          Note: Full access to detailed prescription data is restricted to the patient and their assigned doctors for privacy reasons.
        </p>
      </div>
    </div>
  )
}
