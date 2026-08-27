/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/providers/AuthProvider"
import { Doctor, Gender } from "@/types/api.types"
import { getAllDoctors, updateMyProfile } from "@/services/doctor.services"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function DoctorProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<Doctor>>({})

  useEffect(() => {
    if (user?.id) {
      // Fetch the doctor profile associated with this user
      getAllDoctors({ userId: user.id })
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setDoctor(res.data[0])
            setFormData(res.data[0])
          }
        })
        .catch((err) => console.error("Error fetching doctor profile", err))
        .finally(() => setLoading(false))
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Only send allowed fields for update
      const updateData = {
        name: formData.name,
        contactNumber: formData.contactNumber,
        address: formData.address,
        experience: formData.experience ? Number(formData.experience) : undefined,
        appointmentFee: formData.appointmentFee ? Number(formData.appointmentFee) : undefined,
        qualification: formData.qualification,
        currentWorkingPlace: formData.currentWorkingPlace,
        designation: formData.designation,
        gender: formData.gender,
      }
      
      const res = await updateMyProfile(updateData)
      if (res.success) {
        toast({
          title: "Profile Updated",
          description: "Your doctor profile has been updated successfully.",
        })
        setDoctor(res.data)
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Something went wrong while updating your profile.",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Skeleton className="h-100 w-full max-w-3xl rounded-xl" />
  }

  if (!doctor) {
    return (
      <div className="p-8 text-center bg-muted/30 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
        <p className="text-muted-foreground">We could not find a doctor profile associated with your account.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and contact information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name || ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input id="contactNumber" name="contactNumber" value={formData.contactNumber || ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender || ""} onValueChange={(val) => handleSelectChange("gender", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Gender.MALE}>Male</SelectItem>
                  <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                  <SelectItem value={Gender.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={formData.address || ""} onChange={handleInputChange} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
          <CardDescription>Update your medical qualifications and practice details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input id="designation" name="designation" value={formData.designation || ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input id="qualification" name="qualification" value={formData.qualification || ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentWorkingPlace">Current Working Place</Label>
              <Input id="currentWorkingPlace" name="currentWorkingPlace" value={formData.currentWorkingPlace || ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience (Years)</Label>
              <Input id="experience" name="experience" type="number" value={formData.experience || ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointmentFee">Appointment Fee (৳)</Label>
              <Input id="appointmentFee" name="appointmentFee" type="number" value={formData.appointmentFee || ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input id="registrationNumber" name="registrationNumber" value={formData.registrationNumber || ""} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Registration number cannot be changed.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-6">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Specialties</CardTitle>
          <CardDescription>Specialties linked to your profile by administrators.</CardDescription>
        </CardHeader>
        <CardContent>
          {doctor.specialties && doctor.specialties.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {doctor.specialties.map((ds) => (
                <div key={ds.id} className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                  {ds.specialty?.title || "Specialty"}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No specialties assigned yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

