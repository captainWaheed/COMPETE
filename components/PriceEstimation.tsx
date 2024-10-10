"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

// Mock function to estimate price based on device details
const estimatePrice = (deviceDetails) => {
  // This is a simplified estimation. In a real-world scenario, you'd have a more complex algorithm
  const basePrice = {
    Smartphone: 200,
    Tablet: 150,
  }

  let price = basePrice[deviceDetails.deviceType] || 100

  if (deviceDetails.condition === 'new') price *= 1.5
  if (deviceDetails.condition === 'damaged') price *= 0.6

  // Adjust based on purchase year
  const currentYear = new Date().getFullYear()
  const age = currentYear - parseInt(deviceDetails.purchaseYear)
  price *= Math.max(0.5, 1 - age * 0.1)

  return Math.round(price)
}

// Mock function to simulate sending data to admin and waiting for approval
const sendToAdminForApproval = async (formData) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 3000))
  // Simulate 80% chance of approval
  return Math.random() < 0.8
}

export default function PriceEstimation({ onNext, onPrev, formData, updateFormData }) {
  const [estimatedPrice, setEstimatedPrice] = useState(0)
  const [status, setStatus] = useState('initial') // 'initial', 'pending', 'approved', 'rejected'

  useEffect(() => {
    const price = estimatePrice(formData)
    setEstimatedPrice(price)
  }, [formData])

  const handleAccept = async () => {
    setStatus('pending')
    try {
      const approved = await sendToAdminForApproval({ ...formData, estimatedPrice })
      if (approved) {
        setStatus('approved')
        updateFormData({ estimatedPrice, status: 'approved' })
        setTimeout(() => onNext(), 2000) // Move to next step after 2 seconds
      } else {
        setStatus('rejected')
      }
    } catch (error) {
      console.error('Error during admin approval:', error)
      setStatus('rejected')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Estimated Price</CardTitle>
        <CardDescription>Based on the details you provided</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold text-center text-primary">${estimatedPrice}</p>
        <ul className="mt-4 space-y-2">
          <li><strong>Device Type:</strong> {formData.deviceType}</li>
          <li><strong>Brand:</strong> {formData.brand}</li>
          <li><strong>Model:</strong> {formData.model}</li>
          <li><strong>Condition:</strong> {formData.condition}</li>
          <li><strong>Purchase Year:</strong> {formData.purchaseYear}</li>
        </ul>
        {status === 'pending' && (
          <Alert className="mt-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertTitle>Waiting for Admin Approval</AlertTitle>
            <AlertDescription>
              Your offer has been sent to our admin for review. This usually takes a few minutes.
            </AlertDescription>
          </Alert>
        )}
        {status === 'approved' && (
          <Alert className="mt-4">
            <AlertTitle>Offer Approved!</AlertTitle>
            <AlertDescription>
              Great news! Your offer has been approved. You'll be redirected to the next step shortly.
            </AlertDescription>
          </Alert>
        )}
        {status === 'rejected' && (
          <Alert className="mt-4" variant="destructive">
            <AlertTitle>Offer Rejected</AlertTitle>
            <AlertDescription>
              We're sorry, but your offer couldn't be approved at this time. Please try again or contact support for assistance.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onPrev} disabled={status === 'pending'}>
          Previous
        </Button>
        <Button 
          onClick={handleAccept} 
          disabled={status !== 'initial'}
        >
          {status === 'initial' ? 'Accept Offer' : 'Waiting for Approval'}
        </Button>
      </CardFooter>
    </Card>
  )
}