"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyPrescriptions } from "@/services/prescription.services";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pill, Calendar, Search, AlertCircle, RefreshCw, FileText, Printer, Stethoscope, Download } from "lucide-react";
import { Prescription } from "@/types/api.types";
import { Skeleton } from "@/components/ui/skeleton";
import { PrescriptionViewModal } from "@/components/shared/PrescriptionViewModal";

export default function UserPrescriptionsPage() {
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { 
    data: prescriptionsRes, 
    isLoading, 
    isError,
    refetch
  } = useQuery({
    queryKey: ["user-prescriptions"],
    queryFn: () => getMyPrescriptions(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const prescriptions = prescriptionsRes?.data || [];

  const handleOpenModal = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Prescriptions</h1>
          <p className="text-muted-foreground">View, download and print your official consultation prescriptions.</p>
        </div>
      </div>

      {isError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="size-5" />
            <p className="text-sm font-medium">Failed to load prescriptions. Please try again later.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="border-destructive/30 hover:bg-destructive/10 text-destructive">
            <RefreshCw className="mr-2 size-4" /> Retry
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden shadow-sm border-border/50 flex flex-col h-full">
              <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5 mt-1" />
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-border/50">
                  <Skeleton className="h-9 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : prescriptions.length === 0 && !isError ? (
        <Card className="border-dashed border-2 bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted p-6">
              <Pill className="size-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">No prescriptions found</h3>
            <p className="mt-2 text-muted-foreground max-w-sm">
              Your doctor prescriptions from completed consultations will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {prescriptions.map((prescription: Prescription) => (
            <Card key={prescription.id} className="overflow-hidden shadow-sm transition-all hover:shadow-md border-border/50 flex flex-col h-full bg-card">
              <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                      <FileText className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold">Prescription #{prescription.id.slice(0, 8)}</CardTitle>
                      <CardDescription className="flex items-center gap-1.5 mt-0.5 text-xs">
                        <Calendar className="size-3 text-muted-foreground" />
                        {new Date(prescription.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200">
                    Official Rx
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Doctor Info */}
                  <div className="flex items-start gap-3 bg-muted/20 p-3 rounded-lg border border-border/40">
                    <div className="p-2 bg-primary/10 text-primary rounded-full mt-0.5">
                      <Stethoscope className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        Dr. {prescription.doctor?.name || "Consultant Doctor"}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {prescription.doctor?.designation || "Medical Specialist"} • {prescription.doctor?.qualification || "MBBS"}
                      </p>
                      {prescription.doctor?.currentWorkingPlace && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {prescription.doctor.currentWorkingPlace}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Medicines Preview */}
                  {prescription.medicines && prescription.medicines.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Pill className="size-3.5 text-primary" />
                        Prescribed Medicines ({prescription.medicines.length})
                      </h4>
                      <div className="space-y-1.5">
                        {prescription.medicines.slice(0, 3).map((med, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-md bg-muted/30">
                            <span className="font-semibold text-foreground">{med.medicineName}</span>
                            <span className="text-muted-foreground">{med.frequency} • {med.duration}</span>
                          </div>
                        ))}
                        {prescription.medicines.length > 3 && (
                          <p className="text-[11px] text-muted-foreground text-center pt-1">
                            +{prescription.medicines.length - 3} more medicines
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Advice/Instructions */}
                  {prescription.instructions && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Doctor Advice
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {prescription.instructions}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border/50">
                  <Button 
                    onClick={() => handleOpenModal(prescription)} 
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium shadow-xs"
                  >
                    <Search className="mr-2 size-4" />
                    View & Download Prescription
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Prescription View & Print Modal */}
      <PrescriptionViewModal 
        prescription={selectedPrescription}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
