"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from "@/components/ui/use-toast"
import { storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function UserVerification({ onNext, onPrev, updateFormData }) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    fullName: '',
    idType: '',
    idNumber: '',
    cnic: '',
    email: '',
    phoneNumber: '',
    idImage: null,
    termsAgreed: false,
  })
  const [verificationStatus, setVerificationStatus] = useState('pending')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }))
  }

  const handleIdTypeChange = (value) => {
    setFormData(prev => ({ ...prev, idType: value }))
  }

  const validateForm = () => {
    const { fullName, idType, idNumber, cnic, email, phoneNumber, idImage, termsAgreed } = formData
    if (!fullName || !idType || !idNumber || !cnic || !email || !phoneNumber || !idImage || !termsAgreed) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields and agree to the terms.",
        variant: "destructive",
      })
      return false
    }
    // Add more specific validation (e.g., email format, phone number format, CNIC format) here
    return true
  }

  const handleIdImageUpload = async (file: File) => {
    try {
      const fileName = `${Date.now()}_${file.name}`
      const storageRef = ref(storage, `id-images/${fileName}`)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      return downloadURL
    } catch (error) {
      console.error('Error uploading ID image:', error)
      toast({
        title: "Error",
        description: "Failed to upload ID image. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const simulateVerification = () => {
    setIsSubmitting(true)
    // Simulating an asynchronous verification process
    setTimeout(() => {
      const isVerified = Math.random() > 0.3 // 70% chance of successful verification
      setVerificationStatus(isVerified ? 'verified' : 'failed')
      setIsSubmitting(false)
      if (isVerified) {
        updateFormData(formData)
        onNext()
      } else {
        toast({
          title: "Verification Failed",
          description: "Please check your information and try again.",
          variant: "destructive",
        })
      }
    }, 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      try {
        // Upload ID image to Firebase Storage
        if (formData.idImage instanceof File) {
          const idImageUrl = await handleIdImageUpload(formData.idImage)
          setFormData(prev => ({ ...prev, idImage: idImageUrl }))
        }
        
        updateFormData({ ...formData, idImage: formData.idImage instanceof File ? await handleIdImageUpload(formData.idImage) : formData.idImage })
        simulateVerification()
      } catch (error) {
        console.error('Error uploading ID image:', error)
        toast({
          title: "Error",
          description: "There was a problem uploading your ID image. Please try again.",
          variant: "destructive",
        })
        setIsSubmitting(false)
      }
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">User Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="idType">ID Type</Label>
            <Select onValueChange={handleIdTypeChange} required>
              <SelectTrigger id="idType">
                <SelectValue placeholder="Select ID type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="drivingLicense">Driving License</SelectItem>
                <SelectItem value="nationalId">National ID</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="idNumber">ID Number</Label>
            <Input
              id="idNumber"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnic">CNIC Number</Label>
            <Input
              id="cnic"
              name="cnic"
              value={formData.cnic}
              onChange={handleInputChange}
              placeholder="00000-0000000-0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="idImage">Upload Government-issued ID</Label>
            <Input
              id="idImage"
              name="idImage"
              type="file"
              onChange={handleInputChange}
              accept="image/*"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="termsAgreed"
              name="termsAgreed"
              checked={formData.termsAgreed}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, termsAgreed: checked }))}
              required
            />
            <Label htmlFor="termsAgreed">
              I agree to the terms and conditions and consent to ID verification
            </Label>
          </div>

          <div className="flex justify-between">
            <Button type="button" onClick={onPrev} variant="outline">
              Previous
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Verifying...' : 'Verify and Continue'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}