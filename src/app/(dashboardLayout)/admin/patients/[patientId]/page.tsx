"use client"

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPatientById } from '@/services/patient.services'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, UserRound, Phone, MapPin, CalendarDays } from 'lucide-react'

export default function PatientDetailsPage() {
  const { patientId } = useParams()
  
  const { data: patientData, isLoading, isError } = useQuery({
    queryKey: ['admin-patient', patientId],
    queryFn: () => getPatientById(patientId as string),
    enabled: !!patientId
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError || !patientData?.data) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed text-muted-foreground gap-4">
        <p>Patient not found or failed to load.</p>
        <Button asChild variant="outline">
          <Link href="/admin/patients">Back to Patients</Link>
        </Button>
      </div>
    )
  }

  const patient = patientData.data

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/patients">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Patient Details</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <UserRound className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold">{patient.name}</h3>
              <p className="text-muted-foreground">{patient.email}</p>
              <div className="flex items-center gap-2 mt-2">
                {patient.isDeleted ? (
                  <Badge variant="destructive">Deleted Account</Badge>
                ) : (
                  <Badge variant="outline" className="border-green-500 text-green-600">Active</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Phone className="h-4 w-4" /> Contact Number
              </p>
              <p>{patient.contactNumber || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Address
              </p>
              <p>{patient.address || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CalendarDays className="h-4 w-4" /> Registered On
              </p>
              <p>{new Date(patient.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Admins may not have automatic access to medical records per privacy guidelines. We only show contact info. */}
      <div className="bg-muted/50 border rounded-lg p-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Note: Clinical history and medical records are restricted to assigned doctors and the patient.
        </p>
      </div>
    </div>
  )
}
