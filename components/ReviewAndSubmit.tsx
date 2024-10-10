import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { useToast } from "@/components/ui/use-toast"

interface ReviewAndSubmitProps {
  onPrev: () => void
  formData: any // Replace 'any' with your FormData type
  onSubmit: () => void
}

// Dummy data to use when actual data is missing
const dummyData = {
  deviceSelection: { deviceType: 'Smartphone' },
  deviceDetails: {
    brand: 'Apple',
    model: 'iPhone 14 Pro',
    yearOfPurchase: '2022',
    condition: 'Used',
    storage: '128GB',
    defects: ['Screen cracks'],
    serialNumber: 'IMEI123456789',
  },
  pickupParcel: {
    deliveryMethod: 'Parcel',
    parcelDetails: {
      trackingNumber: 'TRK123456',
      courierName: 'FedEx',
    },
  },
  userVerification: {
    fullName: 'John Doe',
    idType: 'National ID',
    idNumber: '1234567890',
    cnic: '12345-1234567-1',
    email: 'john.doe@example.com',
    phoneNumber: '+1234567890',
  },
  priceEstimation: {
    estimatedPrice: 450,
    status: 'Approved',
  },
}

export default function ReviewAndSubmit({ onPrev, formData, onSubmit }: ReviewAndSubmitProps) {
  const { toast } = useToast()

  // Merge actual data with dummy data, preferring actual data when available
  const mergedData = {
    deviceSelection: { ...dummyData.deviceSelection, ...formData.deviceSelection },
    deviceDetails: { ...dummyData.deviceDetails, ...formData.deviceDetails },
    pickupParcel: { ...dummyData.pickupParcel, ...formData.pickupParcel },
    userVerification: { ...dummyData.userVerification, ...formData.userVerification },
    priceEstimation: { ...dummyData.priceEstimation, ...formData.priceEstimation },
  }

  const handleSubmit = async () => {
    try {
      const docRef = await addDoc(collection(db, 'sell_requests'), {
        deviceSelection: mergedData.deviceSelection,
        deviceDetails: mergedData.deviceDetails,
        pickupParcel: mergedData.pickupParcel,
        userVerification: mergedData.userVerification,
        priceEstimation: mergedData.priceEstimation,
        createdAt: new Date(),
        status: 'pending'
      })
      console.log('Document written with ID: ', docRef.id)
      toast({
        title: "Success",
        description: "Your application has been submitted successfully!",
      })
      onSubmit()
    } catch (error) {
      console.error('Error adding document: ', error)
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Review Your Application</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="font-semibold">Device Information</h3>
          <p>Type: {mergedData.deviceSelection.deviceType}</p>
          <p>Brand: {mergedData.deviceDetails.brand}</p>
          <p>Model: {mergedData.deviceDetails.model}</p>
          <p>Year of Purchase: {mergedData.deviceDetails.yearOfPurchase}</p>
          <p>Condition: {mergedData.deviceDetails.condition}</p>
          <p>Storage: {mergedData.deviceDetails.storage}</p>
          <p>Defects: {mergedData.deviceDetails.defects?.join(', ') || 'None'}</p>
          <p>Serial Number / IMEI: {mergedData.deviceDetails.serialNumber || 'Not provided'}</p>

          <h3 className="font-semibold mt-6">Delivery Method</h3>
          <p>Method: {mergedData.pickupParcel.deliveryMethod}</p>
          {mergedData.pickupParcel.deliveryMethod === 'Pickup' && (
            <>
              <p>Address: {mergedData.pickupParcel.pickupDetails?.address || 'Not provided'}</p>
              <p>Preferred Date: {mergedData.pickupParcel.pickupDetails?.preferredDate || 'Not provided'}</p>
              <p>Special Instructions: {mergedData.pickupParcel.pickupDetails?.specialInstructions || 'None'}</p>
            </>
          )}
          {mergedData.pickupParcel.deliveryMethod === 'Parcel' && (
            <>
              <p>Tracking Number: {mergedData.pickupParcel.parcelDetails?.trackingNumber}</p>
              <p>Courier Name: {mergedData.pickupParcel.parcelDetails?.courierName}</p>
            </>
          )}

          <h3 className="font-semibold mt-6">User Information</h3>
          <p>Full Name: {mergedData.userVerification.fullName}</p>
          <p>ID Type: {mergedData.userVerification.idType}</p>
          <p>ID Number: {mergedData.userVerification.idNumber}</p>
          <p>CNIC: {mergedData.userVerification.cnic}</p>
          <p>Email: {mergedData.userVerification.email}</p>
          <p>Phone Number: {mergedData.userVerification.phoneNumber}</p>

          <h3 className="font-semibold mt-6">Estimated Price</h3>
          <p>Price: ${mergedData.priceEstimation.estimatedPrice}</p>
          <p>Status: {mergedData.priceEstimation.status}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onPrev} variant="outline">
          Previous
        </Button>
        <Button onClick={handleSubmit}>
          Submit Application
        </Button>
      </CardFooter>
    </Card>
  )
}