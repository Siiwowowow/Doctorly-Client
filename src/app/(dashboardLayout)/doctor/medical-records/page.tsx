/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { MedicalRecord } from "@/types/api.types"
import { getAllMedicalRecords } from "@/services/medicalRecord.services"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Search, Calendar, Link as LinkIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

function MedicalRecordList() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const patientIdFilter = searchParams.get("patientId")
  
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const queryParams = patientIdFilter ? { patientId: patientIdFilter } : undefined
        const res = await getAllMedicalRecords(queryParams)
        setRecords(res.data || [])
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load medical records.",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchRecords()
  }, [patientIdFilter, toast])

  const filteredRecords = records.filter((r) => {
    return r.patient?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
           r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           r.id.toLowerCase().includes(searchQuery.toLowerCase())
  })

  // Sort by date, newest first
  filteredRecords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Medical Records</h1>
          <p className="text-muted-foreground">Review clinical notes and uploaded patient records.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search records or patients..." 
              className="pl-8" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground border rounded-lg border-dashed">
              <FileText className="h-12 w-12 opacity-20 mb-3 mx-auto" />
              <p>{patientIdFilter ? "No medical records found for this patient." : "No medical records found."}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div key={record.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-xl hover:border-primary/50 transition-colors gap-4 bg-muted/10">
                  <div className="flex items-start gap-4">
                    <div className="bg-teal-100 p-3 rounded-full shrink-0">
                      <FileText className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{record.patient?.name || "Unknown Patient"}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{format(new Date(record.createdAt), "MMMM dd, yyyy")}</span>
                        </div>
                        {record.appointmentId && (
                          <div className="flex items-center gap-1.5" title="Linked to Appointment">
                            <LinkIcon className="h-3.5 w-3.5" />
                            <span className="truncate max-w-37.5">{record.appointmentId}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 p-3 bg-background border rounded-lg text-sm text-foreground/80">
                        {record.description}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex w-full sm:w-auto mt-2 sm:mt-0">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                      <Link href={`/doctor/patients/${record.patientId}`}>
                        View Patient
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function DoctorMedicalRecordsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-125 w-full" />}>
      <MedicalRecordList />
    </Suspense>
  )
}
