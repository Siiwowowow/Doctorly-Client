/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAllMedicalRecords } from '@/services/medicalRecord.services'
import { MedicalRecord } from '@/types/api.types'
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

export default function MedicalRecordsManagementPage() {
  const { data: recordsData, isLoading, isError } = useQuery({
    queryKey: ['admin-medical-records'],
    queryFn: () => getAllMedicalRecords(),
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
        <p>Failed to load medical records.</p>
      </div>
    )
  }

  const records = recordsData?.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Medical Records</h2>
          <p className="text-muted-foreground">
            Overview of medical records across the platform.
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No medical records found.
                </TableCell>
              </TableRow>
            ) : (
              records.map((record: MedicalRecord) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {format(new Date(record.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{record.patient?.name || "Unknown"}</div>
                    <div className="text-xs text-muted-foreground">{record.patient?.email}</div>
                  </TableCell>
                  <TableCell>
                     {/* Assume there's a type or title field, or we can just show record type if exists */}
                     {(record as any).recordType || "General"}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[300px] truncate" title={record.description}>
                      {record.description || "N/A"}
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
          Note: Full access to detailed medical records, attachments, and clinical notes is restricted to the patient and their assigned doctors for privacy reasons.
        </p>
      </div>
    </div>
  )
}
