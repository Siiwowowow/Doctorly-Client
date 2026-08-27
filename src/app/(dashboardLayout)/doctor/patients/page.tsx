/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Patient, Gender } from "@/types/api.types"
import { getAllPatients } from "@/services/patient.services"
import { Search, User, Phone, MapPin, FileText, Pill } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function DoctorPatientsPage() {
  const { toast } = useToast()
  
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await getAllPatients()
        setPatients(res.data || [])
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error fetching patients",
          description: error.message || "Could not load patient list.",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchPatients()
  }, [])

  const filteredPatients = patients.filter((patient) => {
    return patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (patient.contactNumber && patient.contactNumber.includes(searchQuery))
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Patients</h1>
          <p className="text-muted-foreground">Patients you have consulted or have upcoming appointments with.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or phone..." 
              className="pl-8" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground border rounded-lg border-dashed">
              <User className="h-12 w-12 opacity-20 mb-3 mx-auto" />
              <p>No patients found.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPatients.map((patient) => (
                <Card key={patient.id} className="overflow-hidden hover:border-primary/50 transition-colors flex flex-col">
                  <div className="p-4 flex-1">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-full shrink-0">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-bold truncate" title={patient.name}>{patient.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{patient.email}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                      {patient.contactNumber && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{patient.contactNumber}</span>
                        </div>
                      )}
                      {patient.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{patient.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 border-t flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/doctor/patients/${patient.id}`}>
                        Profile
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/doctor/medical-records?patientId=${patient.id}`}>
                        Records
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
