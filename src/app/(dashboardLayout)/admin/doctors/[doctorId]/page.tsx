"use client"

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDoctorById } from '@/services/doctor.services'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, User, Phone, MapPin, Briefcase, Award, Star } from 'lucide-react'

export default function DoctorDetailsPage() {
  const { doctorId } = useParams()
  
  const { data: doctorData, isLoading, isError } = useQuery({
    queryKey: ['admin-doctor', doctorId],
    queryFn: () => getDoctorById(doctorId as string),
    enabled: !!doctorId
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

  if (isError || !doctorData?.data) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed text-muted-foreground gap-4">
        <p>Doctor not found or failed to load.</p>
        <Button asChild variant="outline">
          <Link href="/admin/doctors">Back to Doctors</Link>
        </Button>
      </div>
    )
  }

  const doctor = doctorData.data

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/doctors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Doctor Details</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">{doctor.name}</h3>
                  <p className="text-muted-foreground">{doctor.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {doctor.isDeleted ? (
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
                    <Briefcase className="h-4 w-4" /> Designation
                  </p>
                  <p>{doctor.designation || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Award className="h-4 w-4" /> Qualification
                  </p>
                  <p>{doctor.qualification || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Current Workplace
                  </p>
                  <p>{doctor.currentWorkingPlace || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Star className="h-4 w-4" /> Experience
                  </p>
                  <p>{doctor.experience ? `${doctor.experience} Years` : "Not provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact & Fees</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Contact Number
                </p>
                <p>{doctor.contactNumber || "Not provided"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Consultation Fee</p>
                <p className="text-2xl font-bold">${doctor.appointmentFee || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specialties</CardTitle>
            </CardHeader>
            <CardContent>
              {doctor.specialties && doctor.specialties.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {doctor.specialties.map((s: any) => (
                    <Badge key={s.specialtyId} variant="secondary">
                      {s.specialty?.title}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No specialties recorded.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
