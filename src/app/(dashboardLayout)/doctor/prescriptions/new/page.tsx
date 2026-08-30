/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createPrescription } from "@/services/prescription.services"
import { getAppointmentById } from "@/services/appointment.services"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Plus, Trash2, ArrowLeft, Pill, FileText, User } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function NewPrescriptionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const initialAppointmentId = searchParams.get("appointmentId") || ""
  
  const [appointmentId, setAppointmentId] = useState(initialAppointmentId)
  const [instructions, setInstructions] = useState("")
  const [medicines, setMedicines] = useState([
    { medicineName: "", dosage: "", frequency: "", duration: "", instructions: "" }
  ])
  const [submitting, setSubmitting] = useState(false)
  
  const queryClient = useQueryClient()

  const { data: appointmentRes, isLoading: loadingAppointment } = useQuery({
    queryKey: ["doctor-appointments", appointmentId],
    queryFn: () => getAppointmentById(appointmentId),
    enabled: !!appointmentId && appointmentId.trim().length >= 3,
    retry: false,
    staleTime: 1000 * 60 * 5,
  })
  
  const appointment = appointmentRes?.data

  const handleAddMedicine = () => {
    setMedicines([...medicines, { medicineName: "", dosage: "", frequency: "", duration: "", instructions: "" }])
  }

  const handleRemoveMedicine = (index: number) => {
    if (medicines.length === 1) return
    const newMedicines = [...medicines]
    newMedicines.splice(index, 1)
    setMedicines(newMedicines)
  }

  const handleMedicineChange = (index: number, field: string, value: string) => {
    const newMedicines = [...medicines]
    newMedicines[index] = { ...newMedicines[index], [field]: value }
    setMedicines(newMedicines)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!appointmentId) {
      toast({ variant: "destructive", title: "Error", description: "Appointment ID is required." })
      return
    }

    // Filter out empty medicines
    const validMedicines = medicines.filter(m => m.medicineName.trim() !== "")
    if (validMedicines.length === 0) {
      toast({ variant: "destructive", title: "Error", description: "Please add at least one medicine." })
      return
    }

    setSubmitting(true)
    try {
      const payload = {
          appointmentId: appointment?.id || appointmentId,
          instructions,
          medicines: validMedicines
        }
      
      await createPrescription(payload as any)
      
      
      toast({
        title: "Success",
        description: "Prescription created successfully.",
      })
      
      queryClient.invalidateQueries({ queryKey: ["doctor-prescriptions"] })
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] })
      
      router.push("/doctor/prescriptions")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to create",
        description: error.message || "An error occurred while creating the prescription.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/doctor/prescriptions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Write Prescription</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              General Details
            </CardTitle>
            <CardDescription>Enter consultation notes and appointment ID.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 max-w-sm">
              <Label htmlFor="appointmentId">Search Patient / Appointment <span className="text-destructive">*</span></Label>
              <Input 
                id="appointmentId" 
                value={appointmentId} 
                onChange={(e) => setAppointmentId(e.target.value)} 
                placeholder="Search by Patient Name, Email, Phone, Patient ID or Appointment ID"
                required
              />
              <p className="text-xs text-muted-foreground">Search by patient name, email, phone number, patient ID or appointment ID to link prescription.</p>
            </div>
            
            {loadingAppointment ? (
              <div className="space-y-2 mt-4">
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            ) : appointment ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-lg flex items-start justify-between gap-3 mt-4 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-full shrink-0 mt-1">
                     <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                     <div className="flex items-center gap-2">
                       <h4 className="font-semibold text-base text-emerald-950 dark:text-emerald-100">{appointment.patient?.name || appointment.patient?.user?.name || "Patient Found"}</h4>
                       {(appointment.patient?.patientHealthData?.bloodGroup || (appointment.patient as any)?.bloodGroup) && (
                         <span className="text-xs bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-semibold px-2 py-0.5 rounded-full">
                           {appointment.patient?.patientHealthData?.bloodGroup || (appointment.patient as any)?.bloodGroup}
                         </span>
                       )}
                     </div>
                     <p className="text-xs text-muted-foreground">Email: {appointment.patient?.email || appointment.patient?.user?.email || "N/A"}</p>
                     {appointment.patient?.contactNumber && (
                       <p className="text-xs text-muted-foreground">Phone: {appointment.patient.contactNumber}</p>
                     )}
                     <p className="text-xs font-mono text-muted-foreground/80 mt-1">Appt ID: {appointment.id}</p>
                  </div>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 uppercase">
                  {appointment.status}
                </span>
              </div>
            ) : appointmentId.trim().length >= 3 ? (
              <p className="text-sm text-destructive mt-2">No matching appointment or patient found.</p>
            ) : null}
            
            <div className="space-y-2 pt-2">
              <Label htmlFor="instructions">General Instructions / Advice</Label>
              <Textarea 
                id="instructions" 
                value={instructions} 
                onChange={(e) => setInstructions(e.target.value)} 
                placeholder="E.g., Drink plenty of water, rest for 3 days..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-blue-500" />
                Medications
              </CardTitle>
              <CardDescription>List the medicines to prescribe.</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleAddMedicine}>
              <Plus className="mr-2 h-4 w-4" />
              Add Medicine
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {medicines.map((medicine, index) => (
                <div key={index} className="p-4 sm:p-6 bg-muted/10 relative">
                  <div className="absolute right-4 top-4">
                    {medicines.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                        onClick={() => handleRemoveMedicine(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-primary/20 text-primary h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <h4 className="font-semibold text-sm">Medicine Details</h4>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Medicine Name <span className="text-destructive">*</span></Label>
                      <Input 
                        value={medicine.medicineName} 
                        onChange={(e) => handleMedicineChange(index, "medicineName", e.target.value)} 
                        placeholder="E.g., Napa Extend 665mg"
                        required={index === 0}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Dosage</Label>
                      <Input 
                        value={medicine.dosage} 
                        onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)} 
                        placeholder="E.g., 1 tablet"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Input 
                        value={medicine.frequency} 
                        onChange={(e) => handleMedicineChange(index, "frequency", e.target.value)} 
                        placeholder="E.g., 1-0-1 (After meal)"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Input 
                        value={medicine.duration} 
                        onChange={(e) => handleMedicineChange(index, "duration", e.target.value)} 
                        placeholder="E.g., 5 days"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Specific Instructions</Label>
                      <Input 
                        value={medicine.instructions} 
                        onChange={(e) => handleMedicineChange(index, "instructions", e.target.value)} 
                        placeholder="E.g., Take with warm water"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-6 border-t flex justify-end gap-3">
            <Button type="button" variant="outline" asChild>
              <Link href="/doctor/prescriptions">Cancel</Link>
            </Button>
            <Button type="submit" disabled={submitting || !appointment}>
              {submitting ? "Saving..." : "Save Prescription"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
