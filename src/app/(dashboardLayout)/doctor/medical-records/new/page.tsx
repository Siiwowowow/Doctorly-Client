/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createMedicalRecord } from "@/services/medicalRecord.services"
import { getAppointmentById } from "@/services/appointment.services"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, FileText, User } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function NewMedicalRecordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const initialAppointmentId = searchParams.get("appointmentId") || ""
  const [appointmentId, setAppointmentId] = useState(initialAppointmentId)
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  
  const queryClient = useQueryClient()

  const { data: appointmentRes, isLoading: loadingAppointment } = useQuery({
    queryKey: ["doctor-appointments", appointmentId],
    queryFn: () => getAppointmentById(appointmentId),
    enabled: !!appointmentId && appointmentId.length > 5,
    staleTime: 1000 * 60 * 5,
  })
  
  const appointment = appointmentRes?.data

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!appointmentId) {
      toast({ variant: "destructive", title: "Error", description: "Appointment ID is required." })
      return
    }

    if (!description.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Clinical notes/description cannot be empty." })
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        appointmentId,
        description
      }
      
      await createMedicalRecord(payload as any)
      
      toast({
        title: "Success",
        description: "Medical record created successfully.",
      })
      
      queryClient.invalidateQueries({ queryKey: ["doctor-medical-records"] })
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] })
      
      router.push("/doctor/medical-records")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to create",
        description: error.message || "An error occurred while creating the medical record.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/doctor/medical-records">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Add Medical Record</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-600" />
              Clinical Notes
            </CardTitle>
            <CardDescription>Document findings, diagnosis, and clinical notes for this consultation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 max-w-sm">
              <Label htmlFor="appointmentId">Appointment ID <span className="text-destructive">*</span></Label>
              <Input 
                id="appointmentId" 
                value={appointmentId} 
                onChange={(e) => setAppointmentId(e.target.value)} 
                placeholder="Enter appointment ID"
                required
              />
              <p className="text-xs text-muted-foreground">The medical record must be tied to an appointment.</p>
            </div>
            
            {loadingAppointment ? (
              <div className="space-y-2">
                <Skeleton className="h-16 w-full max-w-sm rounded-lg" />
              </div>
            ) : appointment ? (
              <div className="bg-primary/5 p-4 rounded-lg flex items-start gap-3 max-w-sm border border-primary/20">
                <div className="bg-primary/10 p-2 rounded-full shrink-0 mt-1">
                   <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                   <h4 className="font-semibold text-sm">{appointment.patient?.name}</h4>
                   <p className="text-xs text-muted-foreground">{appointment.patient?.email}</p>
                   {appointment.patient?.bloodGroup && <p className="text-xs text-red-600 mt-1 font-medium">{appointment.patient.bloodGroup}</p>}
                </div>
              </div>
            ) : appointmentId.length > 5 ? (
              <p className="text-sm text-destructive mt-2">Invalid or unauthorized appointment ID.</p>
            ) : null}
            
            <div className="space-y-2">
              <Label htmlFor="description">Clinical Notes & Findings <span className="text-destructive">*</span></Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="E.g., Patient presented with fever and cough for 3 days. No known allergies. Prescribed antibiotics and rest."
                rows={8}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="pt-6 border-t flex justify-end gap-3">
            <Button type="button" variant="outline" asChild>
              <Link href="/doctor/medical-records">Cancel</Link>
            </Button>
            <Button type="submit" disabled={submitting || !appointment}>
              {submitting ? "Saving..." : "Save Record"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
