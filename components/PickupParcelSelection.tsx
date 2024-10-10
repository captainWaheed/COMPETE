"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

export default function PickupParcelSelection({ onNext, onPrev, updateFormData }) {
  const [selectedOption, setSelectedOption] = useState('')

  const handleNext = () => {
    if (selectedOption) {
      updateFormData({ deliveryMethod: selectedOption })
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Choose Delivery Method</h2>
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
        <p className="text-sm text-gray-500">
          A courier will collect the device from your specified address.
        </p>
      )}
      {selectedOption === 'parcel' && (
        <p className="text-sm text-gray-500">
          You'll need to package and send the device to our processing center. Detailed instructions will be provided.
        </p>
      )}
      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline">
          Previous
        </Button>
        <Button onClick={handleNext} disabled={!selectedOption}>
          Next
        </Button>
      </div>
    </div>
  )
}