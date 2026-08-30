"use client";

import React from "react";
import { Prescription } from "@/types/api.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Printer,
  Calendar,
  HeartPulse,
  CheckCircle2,
  FileText,
  Stethoscope,
  Pill,
} from "lucide-react";
import { format } from "date-fns";

interface PrescriptionViewModalProps {
  prescription: Prescription | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PrescriptionViewModal({
  prescription,
  isOpen,
  onClose,
}: PrescriptionViewModalProps) {
  if (!prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  const patient = prescription.patient;
  const doctor = prescription.doctor;
  
  // Format clean blood group (e.g. O_POSITIVE -> O+)
  const rawBg = (patient as any)?.patientHealthData?.bloodGroup || (patient as any)?.bloodGroup || "";
  const bloodGroup = rawBg
    ? rawBg.replace(/_POSITIVE/gi, "+").replace(/_NEGATIVE/gi, "-")
    : null;

  const gender = (patient as any)?.patientHealthData?.gender;
  
  // Clean doctor name (prevent Dr. Dr. duplicate)
  const cleanDoctorName = doctor?.name
    ? doctor.name.replace(/^Dr.?s*/i, "").trim()
    : "Consultant Physician";

  const formattedDate = prescription.createdAt
    ? format(new Date(prescription.createdAt), "dd MMM yyyy, hh:mm a")
    : "N/A";

  const followUpFormatted = (prescription as any)?.followUpDate
    ? format(new Date((prescription as any)?.followUpDate), "dd MMMM yyyy")
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl w-[95vw] md:w-full max-h-[94vh] flex flex-col p-0 border-border/70 shadow-2xl rounded-2xl overflow-hidden">
        {/* Style block for clean A4 printing */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body {
              visibility: hidden !important;
              background: white !important;
            }
            #prescription-document, #prescription-document * {
              visibility: visible !important;
            }
            #prescription-document {
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              width: 100vw !important;
              height: auto !important;
              padding: 15mm !important;
              margin: 0 !important;
              border: none !important;
              box-shadow: none !important;
              background: white !important;
              color: black !important;
              z-index: 9999999 !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}} />

        {/* Modal Top Bar */}
        <DialogHeader className="p-4 sm:p-5 border-b flex flex-row items-center justify-between no-print bg-muted/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <FileText className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold">Digital Prescription</DialogTitle>
              <p className="text-xs text-muted-foreground font-mono">Ref: #{prescription.id.slice(0, 12)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mr-6">
            <Button size="sm" onClick={handlePrint} className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-sm font-medium">
              <Printer className="size-4" />
              Print / Save PDF
            </Button>
          </div>
        </DialogHeader>

        {/* Scrollable Document Area */}
        <div className="overflow-y-auto overflow-x-hidden flex-1 p-4 sm:p-8 bg-slate-100/60 dark:bg-slate-950/40 flex justify-center">
          <div 
            id="prescription-document" 
            className="w-full max-w-3xl bg-white text-slate-900 p-6 sm:p-10 rounded-xl border border-slate-200/80 shadow-md space-y-6"
          >
            {/* Prescription Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-4 pb-6 border-b-2 border-primary/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <HeartPulse className="size-6 text-primary" />
                  </div>
                  <span className="text-2xl font-black tracking-tight text-primary">Doctorly</span>
                </div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Digital Healthcare Network</p>
                <p className="text-xs text-slate-400">www.doctorly-health.com</p>
              </div>

              <div className="text-left sm:text-right space-y-1 sm:max-w-xs">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Dr. {cleanDoctorName}
                </h3>
                <p className="text-xs font-bold text-primary">
                  {doctor?.designation || "Medical Consultant"}
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  {doctor?.qualification || "MBBS, Registered Physician"}
                </p>
                <p className="text-xs text-slate-500">
                  {doctor?.currentWorkingPlace || "Doctorly Telemedicine Network"}
                </p>
              </div>
            </div>

            {/* Patient Info Card */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400 uppercase tracking-wider font-bold text-[10px]">Patient Name</span>
                <p className="font-bold text-sm text-slate-900">{patient?.name || "Patient"}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-400 uppercase tracking-wider font-bold text-[10px]">Blood Group & Gender</span>
                <div className="flex items-center gap-1.5">
                  {bloodGroup ? (
                    <span className="font-bold text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-mono">
                      {bloodGroup}
                    </span>
                  ) : (
                    <span className="text-slate-600 font-medium">N/A</span>
                  )}
                  {gender && <span className="font-semibold text-slate-600 capitalize">({gender.toLowerCase()})</span>}
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-400 uppercase tracking-wider font-bold text-[10px]">Contact Number</span>
                <p className="font-semibold text-slate-800">{patient?.contactNumber || "N/A"}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-400 uppercase tracking-wider font-bold text-[10px]">Date Issued</span>
                <p className="font-semibold text-slate-800">{formattedDate}</p>
              </div>
            </div>

            {/* Clinical Advice / Instructions */}
            {(prescription.instructions || (prescription as any)?.notes || (prescription as any)?.advice || (prescription as any)?.instructions) && (
              <div className="space-y-1.5 bg-blue-50/70 border border-blue-100 rounded-xl p-4">
                <h4 className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Stethoscope className="size-3.5 text-blue-600" />
                  Clinical Advice & Instructions
                </h4>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                  {prescription.instructions || (prescription as any)?.advice || (prescription as any)?.instructions || (prescription as any)?.notes}
                </p>
              </div>
            )}

            {/* Rx Medications Table */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="text-3xl font-black text-primary italic font-serif">Rx</span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Prescribed Medications
                </h3>
              </div>

              {prescription.medicines && prescription.medicines.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-xs">
                  <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                    <thead>
                      <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                        <th className="py-2.5 px-3 w-10 text-center">#</th>
                        <th className="py-2.5 px-4 font-bold">Medicine Name</th>
                        <th className="py-2.5 px-3">Dosage</th>
                        <th className="py-2.5 px-3">Frequency</th>
                        <th className="py-2.5 px-3">Duration</th>
                        <th className="py-2.5 px-4">Instructions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {prescription.medicines.map((med, idx) => (
                        <tr key={med.id || idx} className="hover:bg-slate-50/60">
                          <td className="py-3 px-3 text-center text-slate-400 font-semibold">{idx + 1}</td>
                          <td className="py-3 px-4 font-bold text-slate-900 text-xs sm:text-sm">{med.medicineName}</td>
                          <td className="py-3 px-3 text-slate-700">{med.dosage || "1 unit"}</td>
                          <td className="py-3 px-3 font-bold text-primary">{med.frequency || "1-0-1"}</td>
                          <td className="py-3 px-3 text-slate-700">{med.duration || "N/A"}</td>
                          <td className="py-3 px-4 text-slate-600 italic text-[11px]">{med.instructions || "As directed"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 border border-dashed rounded-xl bg-slate-50 text-xs">
                  No specific medicines listed in this prescription.
                </div>
              )}
            </div>

            {/* Footer / Follow-up & Verification */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-xs">
              <div className="space-y-2">
                {followUpFormatted && (
                  <div className="inline-flex items-center gap-2 text-slate-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-xs">
                    <Calendar className="size-3.5 text-amber-600" />
                    <span className="font-semibold text-amber-900">Next Follow-up: {followUpFormatted}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium text-[11px]">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  <span>Officially Verified by Doctorly Healthcare System</span>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <div className="h-10 flex items-end justify-start sm:justify-end">
                  <span className="text-sm font-serif italic text-slate-800 font-bold border-b border-slate-400 pb-0.5 px-4">
                    Dr. {cleanDoctorName}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Authorized Digital Signature</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
