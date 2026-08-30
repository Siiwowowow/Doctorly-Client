/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  ShieldCheck, 
  Stethoscope, 
  FileText, 
  GraduationCap, 
  User, 
  Loader2,
  Camera,
  Trash2,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Specialty } from "@/types/api.types";

export default function JoinAsDoctorPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    city: "",
    country: "Bangladesh",
    bmdcRegistrationNumber: "",
    registrationType: "Standard Medical Practitioner",
    specialtyId: "",
    experienceYears: "",
    currentWorkplace: "",
    designation: "",
    qualifications: "",
    consultationFee: "1000",
    about: "",
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    bmdc: null,
    degree: null,
    photo: null,
    nid: null,
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch real specialties from backend
  useEffect(() => {
    async function loadSpecialties() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
        const res = await fetch(`${apiUrl}/specialties`);
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setSpecialties(json.data);
          if (json.data.length > 0) {
            setFormData((prev) => ({ ...prev, specialtyId: prev.specialtyId || json.data[0].id }));
          }
        }
      } catch (err) {
        console.error("Failed to load specialties:", err);
      } finally {
        setLoadingSpecialties(false);
      }
    }
    loadSpecialties();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be under 10MB");
        return;
      }
      setFiles((prev) => ({ ...prev, [type]: file }));
      if (type === "photo") {
        setPhotoPreview(URL.createObjectURL(file));
      }
      toast.success(`${file.name} selected`);
    }
  };

  const handleRemovePhoto = () => {
    setFiles((prev) => ({ ...prev, photo: null }));
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password.trim()) {
        toast.error("Please fill in all required personal information fields.");
        return;
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        return;
      }
    }
    if (step === 2) {
      if (!formData.bmdcRegistrationNumber.trim()) {
        toast.error("BMDC or Medical Registration Number is required.");
        return;
      }
    }
    if (step === 3) {
      if (!formData.qualifications.trim()) {
        toast.error("Please specify your medical degrees/qualifications (e.g. MBBS, FCPS).");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 5));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
      
      // 1. Prepare Multipart Form Data
      const payload = {
        ...formData,
        experienceYears: Number(formData.experienceYears) || 0,
        consultationFee: Number(formData.consultationFee) || 0,
      };

      const formPayload = new FormData();
      formPayload.append("data", JSON.stringify(payload));

      if (files.bmdc) {
        formPayload.append("bmdc", files.bmdc);
      }
      if (files.degree) {
        formPayload.append("degree", files.degree);
      }
      if (files.photo) {
        formPayload.append("photo", files.photo);
        formPayload.append("profilePhoto", files.photo);
      }
      if (files.nid) {
        formPayload.append("nid", files.nid);
      }

      const res = await fetch(`${apiUrl}/doctor-applications`, {
        method: "POST",
        body: formPayload,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit doctor application");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("recentDoctorApplicationEmail", formData.email);
      }
      setIsSubmitted(true);
      toast.success("Doctor application & documents submitted successfully for administrative review!");
    } catch (error: any) {
      toast.error(error.message || "An error occurred while submitting your application.");
    } finally {
      setLoading(false);
    }
  };

  const selectedSpecialtyObj = specialties.find((s) => s.id === formData.specialtyId);

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-muted/20 py-16 px-4 flex items-center justify-center">
        <Card className="w-full max-w-xl text-center shadow-md border-border bg-card">
          <CardHeader className="pb-4">
            <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="size-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Application Submitted Successfully!
            </CardTitle>
            <CardDescription className="text-xs">
              Thank you for applying to join the Doctorly medical specialist network.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6">
            <div className="p-4 rounded-xl bg-muted/30 border border-border text-left text-xs space-y-2">
              <p className="flex justify-between">
                <span className="text-muted-foreground">Applicant Name:</span>
                <span className="font-semibold text-foreground">{formData.fullName}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Registration Number:</span>
                <span className="font-mono font-semibold text-foreground">{formData.bmdcRegistrationNumber}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Specialty:</span>
                <span className="font-semibold text-doctorly-primary">{selectedSpecialtyObj?.title || "General Medicine"}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Current Review Status:</span>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px]">
                  Pending Admin Verification
                </Badge>
              </p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our medical compliance team is reviewing your credentials. You will receive an instant notification once your application is verified and activated.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
            <Button asChild variant="outline" size="sm" className="text-xs">
              <Link href="/doctor-application/status">
                Track Application Status
              </Link>
            </Button>
            <Button asChild size="sm" className="text-xs">
              <Link href="/">
                Return to Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  const stepTitles = [
    "Personal Information",
    "Medical Registration & Specialty",
    "Qualifications & Experience",
    "Certificates & Documents",
    "Review & Submit"
  ];

  return (
    <main className="min-h-screen bg-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-doctorly-primary/10 text-doctorly-primary text-xs font-semibold">
            <ShieldCheck className="size-3.5" />
            <span>Healthcare Practitioner Onboarding</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Join Doctorly as a Verified Specialist
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Provide your medical registration and clinical credentials to offer video consultations, digital prescriptions, and specialized patient care.
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground">
            <span>Step {step} of 5: <span className="text-foreground">{stepTitles[step - 1]}</span></span>
            <span>{Math.round((step / 5) * 100)}% Completed</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-colors ${
                  step >= i ? "bg-doctorly-primary" : "bg-muted"
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Step Card Form */}
        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-6 sm:p-8 space-y-6">

            {/* STEP 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="border-b border-border/50 pb-3">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <User className="size-4 text-doctorly-primary" />
                    Personal & Contact Details
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your official contact information and doctor profile image will be used for credential verification and patient consultations.
                  </p>
                </div>

                {/* Doctor Profile Image Upload */}
                <div className="p-4 rounded-xl border border-border/70 bg-muted/20 flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative group">
                    <Avatar className="size-20 sm:size-22 ring-2 ring-doctorly-primary/30 shadow-xs">
                      {photoPreview ? (
                        <AvatarImage src={photoPreview} alt="Doctor Profile Preview" className="object-cover" />
                      ) : (
                        <AvatarFallback className="bg-doctorly-primary/10 text-doctorly-primary text-xl font-bold">
                          <User className="size-8 opacity-70" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-doctorly-primary text-white shadow-md hover:bg-doctorly-primary/90 transition-transform active:scale-95"
                      title="Upload photo"
                    >
                      <Camera className="size-3.5" />
                    </button>
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-1.5">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <Label className="text-xs font-semibold text-foreground">Doctor Profile Photo</Label>
                      {files.photo && (
                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                          Photo Selected
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      Upload a clear, front-facing professional portrait (JPG, PNG, WEBP, max 10MB).
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={(e) => handleFileChange(e, "photo")}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => photoInputRef.current?.click()}
                        className="text-xs h-8 gap-1.5 font-medium"
                      >
                        <ImageIcon className="size-3.5 text-doctorly-primary" />
                        {files.photo ? "Change Photo" : "Upload Doctor Photo"}
                      </Button>
                      {files.photo && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemovePhoto}
                          className="text-xs h-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 gap-1"
                        >
                          <Trash2 className="size-3.5" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs font-medium">Full Name (with Dr. title) <span className="text-rose-500">*</span></Label>
                    <Input 
                      name="fullName" 
                      placeholder="e.g. Dr. Mohammad Rahman" 
                      value={formData.fullName} 
                      onChange={handleInputChange} 
                      className="text-xs h-9.5"
                      required 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Professional Email <span className="text-rose-500">*</span></Label>
                    <Input 
                      name="email" 
                      type="email" 
                      placeholder="doctor@hospital.org" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      className="text-xs h-9.5"
                      required 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Account Password <span className="text-rose-500">*</span></Label>
                    <Input 
                      name="password" 
                      type="password" 
                      placeholder="Min 6 characters" 
                      value={formData.password} 
                      onChange={handleInputChange} 
                      className="text-xs h-9.5"
                      required 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Phone Number <span className="text-rose-500">*</span></Label>
                    <Input 
                      name="phone" 
                      placeholder="+880 1712 345678" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      className="text-xs h-9.5 font-mono"
                      required 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">City / District</Label>
                    <Input 
                      name="city" 
                      placeholder="e.g. Dhaka, Chittagong" 
                      value={formData.city} 
                      onChange={handleInputChange} 
                      className="text-xs h-9.5"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs font-medium">Residential / Chamber Address</Label>
                    <Input 
                      name="address" 
                      placeholder="House, Road, Area" 
                      value={formData.address} 
                      onChange={handleInputChange} 
                      className="text-xs h-9.5"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Medical Registration & Specialty */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="border-b border-border/50 pb-3">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck className="size-4 text-doctorly-primary" />
                    Medical License & Clinical Specialty
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Provide your medical council registration number and select your verified clinical specialty.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">BMDC / Council Registration Number <span className="text-rose-500">*</span></Label>
                    <Input 
                      name="bmdcRegistrationNumber" 
                      placeholder="e.g. A-12345" 
                      value={formData.bmdcRegistrationNumber} 
                      onChange={handleInputChange} 
                      className="text-xs h-9.5 font-mono"
                      required 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Clinical Specialty <span className="text-rose-500">*</span></Label>
                    {loadingSpecialties ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground h-9.5">
                        <Loader2 className="size-4 animate-spin" /> Loading specialties...
                      </div>
                    ) : (
                      <select
                        name="specialtyId"
                        value={formData.specialtyId}
                        onChange={handleInputChange}
                        className="flex h-9.5 w-full items-center justify-between rounded-md border border-input bg-muted/20 px-3 py-1.5 text-xs ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                      >
                        {specialties.map((spec) => (
                          <option key={spec.id} value={spec.id}>
                            {spec.title}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Years of Clinical Experience</Label>
                    <Input 
                      name="experienceYears" 
                      type="number" 
                      placeholder="e.g. 8" 
                      value={formData.experienceYears} 
                      onChange={handleInputChange} 
                      className="text-xs h-9.5 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Standard Consultation Fee (BDT)</Label>
                    <Input 
                      name="consultationFee" 
                      type="number" 
                      placeholder="e.g. 1000" 
                      value={formData.consultationFee} 
                      onChange={handleInputChange} 
                      className="text-xs h-9.5 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Qualifications & Experience */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="border-b border-border/50 pb-3">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <GraduationCap className="size-4 text-doctorly-primary" />
                    Qualifications & Workplace Experience
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Highlight your medical degrees, hospital designation, and background for patient trust.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Medical Degrees & Qualifications <span className="text-rose-500">*</span></Label>
                    <Input 
                      name="qualifications" 
                      placeholder="e.g. MBBS (DMC), FCPS (Medicine), MD (Cardiology)" 
                      value={formData.qualifications} 
                      onChange={handleInputChange} 
                      className="text-xs h-9.5"
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Current Workplace / Hospital</Label>
                      <Input 
                        name="currentWorkplace" 
                        placeholder="e.g. Dhaka Medical College Hospital" 
                        value={formData.currentWorkplace} 
                        onChange={handleInputChange} 
                        className="text-xs h-9.5"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Designation / Title</Label>
                      <Input 
                        name="designation" 
                        placeholder="e.g. Associate Professor & Consultant" 
                        value={formData.designation} 
                        onChange={handleInputChange} 
                        className="text-xs h-9.5"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Professional Bio & About</Label>
                    <Textarea 
                      name="about" 
                      placeholder="Brief description of your clinical practice, special interests, and patient care philosophy..." 
                      value={formData.about} 
                      onChange={handleInputChange} 
                      rows={4}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Documents & Certificates */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="border-b border-border/50 pb-3">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <FileText className="size-4 text-doctorly-primary" />
                    Verification Documents & Proofs
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Attach scans of your medical registration certificate and degrees for compliance review.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { key: "bmdc", title: "Medical Registration Certificate", desc: "BMDC license or authority certificate scan" },
                    { key: "degree", title: "Medical Degree Certificate", desc: "MBBS or postgraduate certificate" },
                    { key: "nid", title: "Government ID / Passport", desc: "National ID or Passport scan" },
                  ].map((doc) => (
                    <div 
                      key={doc.key}
                      className="p-4 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center bg-muted/10 hover:bg-muted/20 transition-colors"
                    >
                      <Upload className="size-6 text-doctorly-primary mb-2" />
                      <h4 className="text-xs font-semibold text-foreground">{doc.title}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5 mb-3">{doc.desc}</p>
                      
                      <Input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png,.webp" 
                        onChange={(e) => handleFileChange(e, doc.key)} 
                        className="text-[11px] h-8 max-w-[200px]"
                      />

                      {files[doc.key] && (
                        <Badge variant="outline" className="mt-2 text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                          {files[doc.key]?.name}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: Review & Submit */}
            {step === 5 && (
              <div className="space-y-5">
                <div className="border-b border-border/50 pb-3">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <CheckCircle className="size-4 text-emerald-600" />
                    Review Application Summary
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Please verify your information before final submission for administrative review.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Doctor Profile Banner Preview */}
                  <div className="p-4 rounded-xl bg-muted/20 border border-border/60 flex items-center gap-4">
                    <Avatar className="size-16 ring-2 ring-doctorly-primary/30">
                      {photoPreview ? (
                        <AvatarImage src={photoPreview} alt={formData.fullName} className="object-cover" />
                      ) : (
                        <AvatarFallback className="bg-doctorly-primary/10 text-doctorly-primary text-lg font-bold">
                          <User className="size-6" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm text-foreground">{formData.fullName || "Doctor Name"}</h3>
                      <p className="text-xs text-doctorly-primary font-medium">{selectedSpecialtyObj?.title || "Clinical Specialist"}</p>
                      <p className="text-[11px] text-muted-foreground">{formData.currentWorkplace || "Chamber / Hospital"}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-2">
                    <h3 className="font-bold text-sm text-foreground mb-2 flex items-center gap-1.5">
                      <User className="size-3.5 text-doctorly-primary" />
                      Personal & License Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground">
                      <p><span className="font-medium text-foreground">Name:</span> {formData.fullName}</p>
                      <p><span className="font-medium text-foreground">Email:</span> {formData.email}</p>
                      <p><span className="font-medium text-foreground">Phone:</span> {formData.phone}</p>
                      <p><span className="font-medium text-foreground">BMDC Reg:</span> {formData.bmdcRegistrationNumber}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-2">
                    <h3 className="font-bold text-sm text-foreground mb-2 flex items-center gap-1.5">
                      <Stethoscope className="size-3.5 text-doctorly-primary" />
                      Clinical & Practice Summary
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground">
                      <p><span className="font-medium text-foreground">Specialty:</span> {selectedSpecialtyObj?.title || "General Medicine"}</p>
                      <p><span className="font-medium text-foreground">Qualifications:</span> {formData.qualifications}</p>
                      <p><span className="font-medium text-foreground">Workplace:</span> {formData.currentWorkplace || "N/A"}</p>
                      <p><span className="font-medium text-foreground">Fee:</span> ৳{formData.consultationFee}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </CardContent>

          {/* Stepper Navigation Actions */}
          <CardFooter className="flex items-center justify-between border-t border-border/50 p-6 bg-muted/10">
            {step > 1 ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={prevStep}
                className="gap-1.5 text-xs"
              >
                <ArrowLeft className="size-3.5" />
                Previous Step
              </Button>
            ) : (
              <Button asChild variant="outline" size="sm" className="text-xs">
                <Link href="/">
                  Cancel
                </Link>
              </Button>
            )}

            {step < 5 ? (
              <Button 
                size="sm" 
                onClick={nextStep}
                className="gap-1.5 text-xs"
              >
                Next Step
                <ArrowRight className="size-3.5" />
              </Button>
            ) : (
              <Button 
                size="sm" 
                onClick={handleSubmit} 
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs shadow-xs"
              >
                {loading ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle className="size-3.5" />}
                Submit Doctor Application
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
