"use client"

import { useParams } from "next/navigation"
import { getPrescriptionById } from "@/services/prescription.services"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Printer, Stethoscope, User, CalendarDays } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { useQuery } from "@tanstack/react-query"

export default function PrescriptionDetailsPage() {
  const { id } = useParams()

  const { data: prescriptionRes, isLoading, isError } = useQuery({
    queryKey: ["doctor-prescription", id],
    queryFn: () => getPrescriptionById(id as string),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 mins
  })

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-125 w-full" />
      </div>
    )
  }

  if (isError || !prescriptionRes?.data) {
    return (
      <div className="py-16 text-center text-muted-foreground border rounded-lg border-dashed">
        <h2 className="text-xl font-semibold mb-2">Prescription Not Found</h2>
        <p className="mb-4">The prescription you are looking for does not exist or you do not have permission to view it.</p>
        <Button variant="outline" asChild>
          <Link href="/doctor/prescriptions">Return to Prescriptions</Link>
        </Button>
      </div>
    )
  }

  const prescription = prescriptionRes.data

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-background border rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/doctor/prescriptions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="font-bold text-lg">Prescription Details</h1>
            <p className="text-xs text-muted-foreground">ID: {prescription.id}</p>
          </div>
        </div>
        
        <Button variant="default" onClick={() => window.print()} className="print:hidden">
          <Printer className="mr-2 h-4 w-4" />
          Print / Save PDF
        </Button>
      </div>

      <div className="bg-white border shadow-sm rounded-xl overflow-hidden print:shadow-none print:border-none">
        {/* Prescription Header / Clinic Info */}
        <div className="p-8 border-b bg-primary/5 flex justify-between items-start">
          <div className="flex items-center gap-3">
             <div className="bg-primary p-3 rounded-xl text-primary-foreground">
               <Stethoscope className="h-8 w-8" />
             </div>
             <div>
               <h2 className="text-2xl font-bold text-primary">Doctorly Healthcare</h2>
               <p className="text-sm text-muted-foreground">Telemedicine Platform</p>
             </div>
          </div>
          
          <div className="text-right">
             <h3 className="font-bold text-lg">{prescription.doctor?.name || "Attending Doctor"}</h3>
             <p className="text-sm text-muted-foreground">{prescription.doctor?.designation || "Physician"}</p>
             <p className="text-sm text-muted-foreground">{prescription.doctor?.qualification}</p>
          </div>
        </div>

        {/* Patient Details */}
        <div className="p-8 border-b bg-muted/10 grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
              <User className="h-4 w-4" /> Patient Details
            </p>
            <h4 className="font-semibold text-lg">{prescription.patient?.name || "Unknown Patient"}</h4>
            {prescription.patient?.contactNumber && <p className="text-sm">{prescription.patient.contactNumber}</p>}
            {prescription.patient?.bloodGroup && <p className="text-sm text-red-600 font-medium">Blood Group: {prescription.patient.bloodGroup}</p>}
          </div>
          <div className="sm:text-right">
            <p className="text-sm text-muted-foreground mb-1 flex items-center sm:justify-end gap-2">
              <CalendarDays className="h-4 w-4" /> Date of Consultation
            </p>
            <p className="font-semibold">{format(new Date(prescription.createdAt), "MMMM dd, yyyy")}</p>
            <p className="text-sm text-muted-foreground mt-2">Appointment Ref: {prescription.appointmentId.substring(0, 8)}...</p>
          </div>
        </div>

        <div className="p-8 grid md:grid-cols-3 gap-8">
          {/* Left Column: Vitals/Notes */}
          <div className="md:col-span-1 border-r pr-6 space-y-6">
            <div>
              <h4 className="font-bold text-primary border-b pb-2 mb-3">General Advice</h4>
              <p className="text-sm whitespace-pre-wrap">{prescription.instructions || "No general advice provided."}</p>
            </div>
          </div>

          {/* Right Column: Medications Rx */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="font-bold text-primary border-b pb-2 flex items-center gap-2">
              Rx <span className="text-sm font-normal text-muted-foreground">(Medications)</span>
            </h4>
            
            {(!prescription.medicines || prescription.medicines.length === 0) ? (
              <p className="text-sm text-muted-foreground italic">No medicines prescribed.</p>
            ) : (
              <div className="space-y-6">
                {prescription.medicines.map((med, index) => (
                  <div key={med.id || index} className="space-y-1">
                    <div className="flex items-start gap-2">
                      <span className="font-bold">{index + 1}.</span>
                      <div>
                        <h5 className="font-bold text-lg">{med.medicineName}</h5>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                          {med.dosage && <span><strong className="text-foreground">Dosage:</strong> {med.dosage}</span>}
                          {med.frequency && <span><strong className="text-foreground">Frequency:</strong> {med.frequency}</span>}
                          {med.duration && <span><strong className="text-foreground">Duration:</strong> {med.duration}</span>}
                        </div>
                        {med.instructions && (
                          <p className="text-sm mt-1 bg-muted/30 p-2 rounded-md italic">
                            &quot;{med.instructions}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer Signature */}
        <div className="p-8 pt-16 flex justify-end print:pt-32">
          <div className="text-center border-t-2 border-primary/20 pt-2 w-48">
            <h5 className="font-bold">{prescription.doctor?.name}</h5>
            <p className="text-xs text-muted-foreground">Signature</p>
          </div>
        </div>
      </div>
    </div>
  )
}
