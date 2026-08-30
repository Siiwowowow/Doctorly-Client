/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Prescription } from "@/types/api.types"
import { getMyPrescriptions } from "@/services/prescription.services"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Pill, Search, Calendar, FileText, Plus, Printer } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { PrescriptionViewModal } from "@/components/shared/PrescriptionViewModal"

function PrescriptionList() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const patientIdFilter = searchParams.get("patientId")
  
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await getMyPrescriptions()
        let data = res.data || []
        
        if (patientIdFilter) {
          data = data.filter((p: Prescription) => p.patientId === patientIdFilter)
        }
        
        setPrescriptions(data)
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load prescriptions.",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchPrescriptions()
  }, [patientIdFilter, toast])

  const filteredPrescriptions = prescriptions.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.patient?.name && p.patient.name.toLowerCase().includes(q)) ||
      (p.patient?.email && p.patient.email.toLowerCase().includes(q)) ||
      (p.patient?.contactNumber && p.patient.contactNumber.toLowerCase().includes(q)) ||
      (p.id && p.id.toLowerCase().includes(q)) ||
      (p.appointmentId && p.appointmentId.toLowerCase().includes(q)) ||
      (p.instructions && p.instructions.toLowerCase().includes(q)) ||
      (p.medicines && p.medicines.some(m => m.medicineName && m.medicineName.toLowerCase().includes(q)))
    )
  })

  // Sort by created date, newest first
  filteredPrescriptions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const handleOpenModal = (prescription: Prescription) => {
    setSelectedPrescription(prescription)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Patient Prescriptions</h1>
          <p className="text-muted-foreground">Manage, view and print patient prescriptions.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-white">
          <Link href="/doctor/prescriptions/new">
            <Plus className="mr-2 h-4 w-4" />
            Write Prescription
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by patient, medicine or ID..." 
              className="pl-8" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : filteredPrescriptions.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground border rounded-lg border-dashed">
              <Pill className="h-12 w-12 opacity-20 mb-3 mx-auto" />
              <p>{patientIdFilter ? "No prescriptions found for this patient." : "No prescriptions found."}</p>
              <Button variant="link" asChild className="mt-2">
                <Link href="/doctor/prescriptions/new">Write a new prescription</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPrescriptions.map((prescription) => (
                <div key={prescription.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-xl hover:border-primary/50 transition-colors gap-4 bg-card">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full shrink-0 text-primary">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{prescription.patient?.name || "Unknown Patient"}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{format(new Date(prescription.createdAt), "MMM dd, yyyy, hh:mm a")}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Pill className="h-3.5 w-3.5 text-primary" />
                          <span className="font-semibold text-foreground">{prescription.medicines?.length || 0} Medicines</span>
                        </div>
                      </div>
                      {prescription.instructions && (
                        <p className="text-xs mt-2 text-muted-foreground line-clamp-1 italic">
                          &quot;{prescription.instructions}&quot;
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex w-full sm:w-auto mt-2 sm:mt-0 gap-2">
                    <Button 
                      onClick={() => handleOpenModal(prescription)} 
                      variant="outline" 
                      className="w-full sm:w-auto gap-2"
                    >
                      <Printer className="size-4" />
                      View & Print / PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prescription View & Print Modal */}
      <PrescriptionViewModal 
        prescription={selectedPrescription}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default function DoctorPrescriptionsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-125 w-full" />}>
      <PrescriptionList />
    </Suspense>
  )
}
