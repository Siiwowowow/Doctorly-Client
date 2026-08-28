"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyPrescriptions } from "@/services/prescription.services";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill, Calendar, Search, AlertCircle, RefreshCw } from "lucide-react";
import { Prescription } from "@/types/api.types";
import { Skeleton } from "@/components/ui/skeleton";

export default function PrescriptionsPage() {
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

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Prescriptions</h1>
          <p className="text-muted-foreground">View your digital prescriptions.</p>
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
              Your doctor prescriptions from online consultations will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {prescriptions.map((prescription: Prescription) => (
            <Card key={prescription.id} className="overflow-hidden shadow-sm transition-all hover:shadow-md border-border/50 flex flex-col h-full">
              <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-doctorly-primary/10 text-doctorly-primary rounded-lg">
                      <Pill className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Prescription #{prescription.id.slice(0, 8)}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                        <Calendar className="size-3" />
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">Prescribed By</h4>
                    <p className="font-medium">{prescription.doctor?.name || "Unknown Doctor"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">Instructions</h4>
                    <p className="text-sm leading-relaxed">{prescription.instructions || "No additional instructions provided."}</p>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-3 pt-4 border-t border-border/50">
                  <Button variant="outline" className="w-full" disabled>
                    <Search className="mr-2 size-4" />
                    View Details
                  </Button>
                  {/* Download PDF removed as there's no backend endpoint for PDF prescriptions yet */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
