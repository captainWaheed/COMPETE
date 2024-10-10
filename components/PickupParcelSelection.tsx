"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

export default function PickupParcelSelection({ onNext, onPrev, updateFormData }) {
  const [selectedOption, setSelectedOption] = useState('')
  const [pickupDetails, setPickupDetails] = useState({
    address: '',
    preferredDate: '',
    specialInstructions: '',
  })
  const [parcelDetails, setParcelDetails] = useState({
    trackingNumber: '',
    courierName: '',
    agreeToTerms: false,
  })

  const handlePickupDetailsChange = (e) => {
    const { name, value } = e.target
    setPickupDetails(prev => ({ ...prev, [name]: value }))
  }

  const handleParcelDetailsChange = (e) => {
    const { name, value, type, checked } = e.target
    setParcelDetails(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleNext = () => {
    if (selectedOption) {
      const formData = {
        deliveryMethod: selectedOption,
        ...(selectedOption === 'pickup' ? pickupDetails : parcelDetails),
      }
      updateFormData(formData)
      onNext()
    }
  }

  const isNextDisabled = () => {
    if (selectedOption === 'pickup') {
      return !pickupDetails.address || !pickupDetails.preferredDate
    }
    if (selectedOption === 'parcel') {
      return !parcelDetails.trackingNumber || !parcelDetails.courierName || !parcelDetails.agreeToTerms
    }
    return true
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Choose Delivery Method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup onValueChange={setSelectedOption} className="space-y-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pickup" id="pickup" />
            <Label htmlFor="pickup">Pickup Service</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="parcel" id="parcel" />
            <Label htmlFor="parcel">Parcel Service</Label>
          </div>
        </RadioGroup>

        {selectedOption === 'pickup' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              A courier will collect the device from your specified address.
            </p>
            <div className="space-y-2">
              <Label htmlFor="address">Pickup Address</Label>
              <Input
                id="address"
                name="address"
                value={pickupDetails.address}
                onChange={handlePickupDetailsChange}
                placeholder="Enter your full address"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredDate">Preferred Pickup Date</Label>
              <Input
                id="preferredDate"
                name="preferredDate"
                type="date"
                value={pickupDetails.preferredDate}
                onChange={handlePickupDetailsChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
              <Textarea
                id="specialInstructions"
                name="specialInstructions"
                value={pickupDetails.specialInstructions}
                onChange={handlePickupDetailsChange}
                placeholder="Any additional information for the courier"
              />
            </div>
          </div>
        )}

        {selectedOption === 'parcel' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              You'll need to package and send the device to our processing center. Please provide the following details:
            </p>
            <div className="space-y-2">
              <Label htmlFor="trackingNumber">Tracking Number</Label>
              <Input
                id="trackingNumber"
                name="trackingNumber"
                value={parcelDetails.trackingNumber}
                onChange={handleParcelDetailsChange}
                placeholder="Enter the tracking number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courierName">Courier Name</Label>
              <Input
                id="courierName"
                name="courierName"
                value={parcelDetails.courierName}
                onChange={handleParcelDetailsChange}
                placeholder="Enter the courier service name"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeToTerms"
                name="agreeToTerms"
                checked={parcelDetails.agreeToTerms}
                onCheckedChange={(checked) => handleParcelDetailsChange({ target: { name: 'agreeToTerms', type: 'checkbox', checked } })}
              />
              <Label htmlFor="agreeToTerms">
                I agree to the terms and conditions for shipping the device
              </Label>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button onClick={onPrev} variant="outline">
            Previous
          </Button>
          <Button onClick={handleNext} disabled={isNextDisabled()}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}