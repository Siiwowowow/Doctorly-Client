"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { User, Phone, MapPin, Mail, Calendar, Droplet } from "lucide-react";
import { EditProfileDialog } from "./EditProfileDialog";
import { Patient } from "@/types/api.types";

interface PatientProfileViewProps {
  initialProfile: Patient;
}

export function formatBloodGroup(bg?: string | null): string {
  if (!bg) return "Not provided";
  const map: Record<string, string> = {
    A_POSITIVE: "A+",
    A_NEGATIVE: "A-",
    B_POSITIVE: "B+",
    B_NEGATIVE: "B-",
    AB_POSITIVE: "AB+",
    AB_NEGATIVE: "AB-",
    O_POSITIVE: "O+",
    O_NEGATIVE: "O-",
    "A+": "A+",
    "A-": "A-",
    "B+": "B+",
    "B-": "B-",
    "AB+": "AB+",
    "AB-": "AB-",
    "O+": "O+",
    "O-": "O-",
  };
  return map[bg] || bg;
}

export function PatientProfileView({ initialProfile }: PatientProfileViewProps) {
  const [profile, setProfile] = useState<Patient>(initialProfile);

  const handleProfileUpdated = (updated: Patient) => {
    setProfile(updated);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      {/* Profile Header */}
      <Card className="border-none shadow-md overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-doctorly-primary/80 to-doctorly-primary"></div>
        <CardContent className="px-6 pb-6 sm:px-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-12">
            <Avatar className="size-32 border-4 border-background shadow-md">
              <AvatarImage src={profile.profilePhoto || undefined} alt={profile.name} />
              <AvatarFallback className="bg-doctorly-primary/10 text-3xl font-bold text-doctorly-primary">
                {profile.name?.slice(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left mb-2">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-muted-foreground">{profile.email}</p>
            </div>
            <EditProfileDialog profile={profile} onProfileUpdated={handleProfileUpdated} />
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <User className="size-5 text-doctorly-primary" />
            Personal Information
          </CardTitle>
          <CardDescription>View and manage your personal details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Full Name</Label>
              <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border/50">
                <User className="size-4 text-muted-foreground" />
                <span className="font-medium">{profile.name}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Email Address</Label>
              <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border/50">
                <Mail className="size-4 text-muted-foreground" />
                <span className="font-medium">{profile.email}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Contact Number</Label>
              <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border/50">
                <Phone className="size-4 text-muted-foreground" />
                <span className="font-medium">{profile.contactNumber || "Not provided"}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Blood Group</Label>
              <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border/50">
                <Droplet className="size-4 text-red-500/70" />
                <span className="font-medium">{formatBloodGroup(profile.bloodGroup || profile.patientHealthData?.bloodGroup)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Member Since</Label>
              <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border/50">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="font-medium">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-muted-foreground">Address</Label>
              <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border/50">
                <MapPin className="size-4 text-muted-foreground shrink-0" />
                <span className="font-medium">{profile.address || "Not provided"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
