import React from "react";
import { getMyMedicalRecords } from "@/services/medicalRecord.services";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, Activity, Search } from "lucide-react";
import { MedicalRecord } from "@/types/api.types";
export const metadata = {
  title: "Medical Records | Doctorly",
};

export default async function MedicalRecordsPage() {
  let records: MedicalRecord[] = [];
  let errorMsg: string | null = null;
  try {
    const res = await getMyMedicalRecords();
    records = res.data || [];
  } catch (error) {
    console.error("Failed to load medical records:", error);
    errorMsg = "Failed to load medical records. Please try again later.";
  }

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Medical Records</h1>
          <p className="text-muted-foreground">Access your consultation notes, diagnosis, and reports.</p>
        </div>
      </div>

      {errorMsg ? (
        <Card className="border-dashed border-2 border-red-500/50 bg-red-500/10">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <h3 className="text-xl font-semibold text-red-500">Error Loading Medical Records</h3>
            <p className="mt-2 text-muted-foreground">{errorMsg}</p>
          </CardContent>
        </Card>
      ) : records.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted p-6">
              <FileText className="size-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">No medical records found</h3>
            <p className="mt-2 text-muted-foreground max-w-sm">
              Your medical records from completed consultations will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {records.map((record: MedicalRecord) => (
            <Card key={record.id} className="overflow-hidden shadow-sm transition-all hover:shadow-md border-border/50 flex flex-col h-full">
              <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-doctorly-primary/10 text-doctorly-primary rounded-lg">
                      <Activity className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Medical Record #{record.id.slice(0, 8)}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                        <Calendar className="size-3" />
                        {new Date(record.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">Doctor</h4>
                    <p className="font-medium">{record.doctor?.name || "Unknown Doctor"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">Diagnosis / Notes</h4>
                    <p className="text-sm leading-relaxed">{record.description || "No specific notes provided."}</p>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-3 pt-4 border-t border-border/50">
                  <Button variant="outline" className="w-full" disabled>
                    <Search className="mr-2 size-4" />
                    View Details
                  </Button>
                  <Button variant="outline" className="w-full text-doctorly-primary border-doctorly-primary/30 hover:bg-doctorly-primary/10" disabled>
                    <Download className="mr-2 size-4" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
