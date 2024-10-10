"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

// Remove the basePrices object as we'll fetch real-time prices

export default function PriceEstimation({ onNext, onPrev, formData, updateFormData }) {
  const [status, setStatus] = useState('initial') // 'initial', 'pending', 'approved', 'rejected'
  const [estimatedPrice, setEstimatedPrice] = useState(0)
  const [realTimePrices, setRealTimePrices] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRealTimePrices()
  }, [])

  useEffect(() => {
    if (Object.keys(realTimePrices).length > 0) {
      calculateEstimatedPrice()
    }
  }, [formData, realTimePrices])

  const fetchRealTimePrices = async () => {
    try {
      // Replace this with your actual API endpoint
      const response = await fetch('/api/real-time-prices')
      const data = await response.json()
      setRealTimePrices(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching real-time prices:', error)
      setLoading(false)
    }
  }

  const calculateEstimatedPrice = () => {
    const { brand, model, condition, storage, defects, yearOfPurchase } = formData.deviceDetails
    let price = realTimePrices[brand]?.[model] || 500 // Default to 500 if not found

    // Adjust price based on condition
    if (condition === 'new') {
      price *= 1.2
    } else if (condition === 'fair') {
      price *= 0.8
    } else if (condition === 'poor') {
      price *= 0.6
    }

    // Adjust price based on storage
    const storageGB = parseInt(storage)
    if (storageGB >= 512) {
      price += 200
    } else if (storageGB >= 256) {
      price += 100
    } else if (storageGB >= 128) {
      price += 50
    }

    // Deduct price for defects
    price -= defects.length * 50

    // Adjust price based on year of purchase
    const currentYear = new Date().getFullYear()
    const age = currentYear - parseInt(yearOfPurchase)
    price -= age * 50

    setEstimatedPrice(Math.max(Math.round(price), 0))
  }

  const handleAccept = async () => {
    setStatus('pending')
    // Simulate API call for admin approval
    setTimeout(() => {
      const approved = Math.random() < 0.8 // 80% chance of approval
      setStatus(approved ? 'approved' : 'rejected')
      if (approved) {
        updateFormData({ status: 'approved', estimatedPrice }, 'priceEstimation')
        setTimeout(onNext, 2000) // Move to next step after 2 seconds
      }
    }, 3000)
  }

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="ml-2">Loading real-time prices...</p>
        </CardContent>
      </Card>
    )
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
          <li><strong>Device Type:</strong> {formData.deviceSelection.deviceType}</li>
          <li><strong>Brand:</strong> {formData.deviceDetails.brand}</li>
          <li><strong>Model:</strong> {formData.deviceDetails.model}</li>
          <li><strong>Condition:</strong> {formData.deviceDetails.condition}</li>
          <li><strong>Purchase Year:</strong> {formData.deviceDetails.yearOfPurchase}</li>
          <li><strong>Storage:</strong> {formData.deviceDetails.storage}</li>
          <li><strong>Defects:</strong> {formData.deviceDetails.defects.join(', ') || 'None'}</li>
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