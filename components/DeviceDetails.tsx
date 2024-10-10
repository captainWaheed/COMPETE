import React from 'react'
import { Button } from '@/components/ui/button'

export default function DeviceDetails({ onNext, onPrev, updateFormData }) {
  // Implement the component logic here
  return (
    <div>
      <h2>Device Details</h2>
      {/* Add form fields for device details */}
      <div>
        <Button onClick={onPrev}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  )
}