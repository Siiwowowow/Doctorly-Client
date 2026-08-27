/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Patient } from "@/types/api.types"
import { getPatientById } from "@/services/patient.services"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { User, Phone, MapPin, Mail, Calendar, FileText, Pill} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function DoctorPatientDetailsPage() {
  const { patientId } = useParams()
  const { toast } = useToast()
  
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await getPatientById(patientId as string)
        setPatient(res.data)
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load patient details.",
        })
      } finally {
        setLoading(false)
      }
    }
    
    if (patientId) {
      fetchPatient()
    }
  }, [patientId,toast])

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-37.5 w-full rounded-xl" />
        <Skeleton className="h-75 w-full rounded-xl" />
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-2xl font-bold mb-2">Patient Not Found</h2>
        <p className="text-muted-foreground mb-6">You may not have permission to view this patient's details.</p>
        <Button asChild>
          <Link href="/doctor/patients">Back to Patient List</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-background border rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/doctor/patients">← Back</Link>
          </Button>
          <div>
            <h1 className="font-bold text-lg">Patient Profile</h1>
            <p className="text-xs text-muted-foreground">ID: {patient.id}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: Personal Info */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-6 rounded-full mb-4">
                <User className="h-16 w-16 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">{patient.name}</h2>
              <p className="text-muted-foreground text-sm mb-4">Patient</p>
              
              <div className="w-full space-y-3 mt-4 text-sm text-left">
                <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-md">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{patient.email}</span>
                </div>
                {patient.contactNumber && (
                  <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-md">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.contactNumber}</span>
                  </div>
                )}
                {patient.address && (
                  <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-md">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Clinical Data Access */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Overview</CardTitle>
              <CardDescription>Access patient's medical history and records.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Medical Records */}
                <div className="border rounded-xl p-5 hover:bg-muted/30 transition-colors flex flex-col items-center text-center">
                  <div className="bg-teal-100 text-teal-600 p-3 rounded-full mb-3">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg">Medical Records</h3>
                  <p className="text-sm text-muted-foreground mb-4 mt-1">View previous diagnoses, notes, and uploaded documents.</p>
                  <Button variant="outline" className="w-full mt-auto text-teal-600 border-teal-200" asChild>
                    <Link href={`/doctor/medical-records?patientId=${patient.id}`}>View Records</Link>
                  </Button>
                </div>

                {/* Prescriptions */}
                <div className="border rounded-xl p-5 hover:bg-muted/30 transition-colors flex flex-col items-center text-center">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-3">
                    <Pill className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg">Prescriptions</h3>
                  <p className="text-sm text-muted-foreground mb-4 mt-1">View past prescriptions and medication history.</p>
                  <Button variant="outline" className="w-full mt-auto text-blue-600 border-blue-200" asChild>
                    <Link href={`/doctor/prescriptions?patientId=${patient.id}`}>View Prescriptions</Link>
                  </Button>
                </div>

                {/* Appointment History */}
                <div className="border rounded-xl p-5 hover:bg-muted/30 transition-colors flex flex-col items-center text-center sm:col-span-2">
                  <div className="bg-purple-100 text-purple-600 p-3 rounded-full mb-3">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg">Appointment History</h3>
                  <p className="text-sm text-muted-foreground mb-4 mt-1">View past and upcoming consultations with this patient.</p>
                  <Button variant="outline" className="w-full max-w-xs mt-auto text-purple-600 border-purple-200" asChild>
                    <Link href={`/doctor/appointments?search=${patient.name}`}>View Appointments</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
