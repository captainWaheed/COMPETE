"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

// Mock function to estimate price based on device details
const estimatePrice = (deviceDetails) => {
  // This is a simplified estimation. In a real-world scenario, you'd have a more complex algorithm
  const basePrice = {
    Smartphone: 200,
    Tablet: 150,
    Laptop: 300,
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

export default function PriceEstimation({ onNext, onPrev, formData, updateFormData }) {
  const [estimatedPrice, setEstimatedPrice] = useState(0)

  useEffect(() => {
    const price = estimatePrice(formData)
    setEstimatedPrice(price)
  }, [formData])

  const handleAccept = () => {
    updateFormData({ estimatedPrice })
    onNext()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estimated Price</CardTitle>
        <CardDescription>Based on the details you provided</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold text-center">${estimatedPrice}</p>
        <ul className="mt-4 space-y-2">
          <li>Device Type: {formData.deviceType}</li>
          <li>Brand: {formData.brand}</li>
          <li>Model: {formData.model}</li>
          <li>Condition: {formData.condition}</li>
          <li>Purchase Year: {formData.purchaseYear}</li>
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>Previous</Button>
        <Button onClick={handleAccept}>Accept Offer</Button>
      </CardFooter>
    </Card>
  )
}