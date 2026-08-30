"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit3, Loader2 } from "lucide-react";
import { updatePatientProfile } from "@/services/patient.services";
import { toast } from "sonner";
import { BloodGroup, Patient } from "@/types/api.types";

interface EditProfileDialogProps {
  profile: Patient;
  onProfileUpdated?: (updated: Patient) => void;
}

const BLOOD_GROUPS = [
  { value: BloodGroup.A_POSITIVE, label: "A+ (A Positive)" },
  { value: BloodGroup.A_NEGATIVE, label: "A- (A Negative)" },
  { value: BloodGroup.B_POSITIVE, label: "B+ (B Positive)" },
  { value: BloodGroup.B_NEGATIVE, label: "B- (B Negative)" },
  { value: BloodGroup.AB_POSITIVE, label: "AB+ (AB Positive)" },
  { value: BloodGroup.AB_NEGATIVE, label: "AB- (AB Negative)" },
  { value: BloodGroup.O_POSITIVE, label: "O+ (O Positive)" },
  { value: BloodGroup.O_NEGATIVE, label: "O- (O Negative)" },
];

const normalizeBloodGroup = (bg?: string | null): string => {
  if (!bg) return "";
  const map: Record<string, string> = {
    "A+": BloodGroup.A_POSITIVE,
    "A-": BloodGroup.A_NEGATIVE,
    "B+": BloodGroup.B_POSITIVE,
    "B-": BloodGroup.B_NEGATIVE,
    "AB+": BloodGroup.AB_POSITIVE,
    "AB-": BloodGroup.AB_NEGATIVE,
    "O+": BloodGroup.O_POSITIVE,
    "O-": BloodGroup.O_NEGATIVE,
    A_POSITIVE: BloodGroup.A_POSITIVE,
    A_NEGATIVE: BloodGroup.A_NEGATIVE,
    B_POSITIVE: BloodGroup.B_POSITIVE,
    B_NEGATIVE: BloodGroup.B_NEGATIVE,
    AB_POSITIVE: BloodGroup.AB_POSITIVE,
    AB_NEGATIVE: BloodGroup.AB_NEGATIVE,
    O_POSITIVE: BloodGroup.O_POSITIVE,
    O_NEGATIVE: BloodGroup.O_NEGATIVE,
  };
  return map[bg] || bg;
};

export function EditProfileDialog({ profile, onProfileUpdated }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialBg = normalizeBloodGroup(profile.bloodGroup || profile.patientHealthData?.bloodGroup);

  const [formData, setFormData] = useState({
    name: profile.name || "",
    contactNumber: profile.contactNumber || "",
    address: profile.address || "",
    bloodGroup: initialBg,
  });

  useEffect(() => {
    const currentBg = normalizeBloodGroup(profile.bloodGroup || profile.patientHealthData?.bloodGroup);
    setFormData({
      name: profile.name || "",
      contactNumber: profile.contactNumber || "",
      address: profile.address || "",
      bloodGroup: currentBg,
    });
  }, [profile, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectBloodGroup = (value: string) => {
    setFormData((prev) => ({ ...prev, bloodGroup: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload: {
      name: string;
      contactNumber?: string;
      address?: string;
      bloodGroup?: BloodGroup;
      patientHealthData?: {
        bloodGroup?: BloodGroup;
      };
    } = {
      name: formData.name.trim(),
    };

    if (formData.contactNumber) {
      payload.contactNumber = formData.contactNumber.trim();
    }
    if (formData.address) {
      payload.address = formData.address.trim();
    }
    if (formData.bloodGroup) {
      payload.bloodGroup = formData.bloodGroup as BloodGroup;
      payload.patientHealthData = {
        bloodGroup: formData.bloodGroup as BloodGroup,
      };
    }

    // Optimistic UI update immediately
    const optimisticUpdated: Patient = {
      ...profile,
      name: formData.name.trim(),
      contactNumber: formData.contactNumber ? formData.contactNumber.trim() : profile.contactNumber,
      address: formData.address ? formData.address.trim() : profile.address,
      bloodGroup: formData.bloodGroup || profile.bloodGroup,
      patientHealthData: {
        ...(profile.patientHealthData || {}),
        bloodGroup: (formData.bloodGroup as BloodGroup) || profile.patientHealthData?.bloodGroup,
      },
    };

    if (onProfileUpdated) {
      onProfileUpdated(optimisticUpdated);
    }

    try {
      const targetId = profile.id || profile.userId;
      const res = await updatePatientProfile(targetId, payload);
      if (res && res.data && onProfileUpdated) {
        onProfileUpdated({
          ...optimisticUpdated,
          ...res.data,
          bloodGroup: formData.bloodGroup || res.data.bloodGroup || profile.bloodGroup,
          patientHealthData: {
            ...(res.data.patientHealthData || {}),
            bloodGroup: (formData.bloodGroup as BloodGroup) || res.data.patientHealthData?.bloodGroup,
          },
        });
      }
      toast.success("Profile updated successfully!");
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
      // Revert if error
      if (onProfileUpdated) {
        onProfileUpdated(profile);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 mb-2">
          <Edit3 className="size-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update your personal details below and click Save Changes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="017XXXXXXXX"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bloodGroup">Blood Group</Label>
            <Select 
              value={formData.bloodGroup || "SELECT"} 
              onValueChange={(val) => handleSelectBloodGroup(val === "SELECT" ? "" : val)}
            >
              <SelectTrigger id="bloodGroup">
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SELECT" disabled>Select blood group</SelectItem>
                {BLOOD_GROUPS.map((bg) => (
                  <SelectItem key={bg.value} value={bg.value}>
                    {bg.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
            />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-doctorly-primary text-white hover:bg-doctorly-primary/90">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
