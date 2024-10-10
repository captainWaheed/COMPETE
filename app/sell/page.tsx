"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DeviceSelection from '@/components/DeviceSelection'
import DeviceDetails from '@/components/DeviceDetails'
import PickupParcelSelection from '@/components/PickupParcelSelection'
import UserVerification from '@/components/UserVerification'
import PriceEstimation from '@/components/PriceEstimation'
import PaymentSelection from '@/components/PaymentSelection'

const steps = [
  'Device Selection',
  'Device Details',
  'Pickup or Parcel',
  'User Verification',
  'Price Estimation',
  'Payment Selection',
]

interface FormData {
  deviceType?: string
  brand?: string
  model?: string
  purchaseYear?: string
  condition?: string
  storageCapacity?: string
  defects?: string[]
  serialNumber?: string
  images?: File[]
  deliveryMethod?: 'pickup' | 'parcel'
  userIdentification?: File
  emailVerification?: string
  phoneVerification?: string
  estimatedPrice?: number
  paymentMethod?: 'bank_transfer' | 'paypal' | 'apple_pay' | 'google_pay'
}

export default function SellPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({})

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <DeviceSelection onNext={nextStep} updateFormData={updateFormData} />
      case 1:
        return <DeviceDetails onNext={nextStep} onPrev={prevStep} updateFormData={updateFormData} formData={formData} />
      case 2:
        return <PickupParcelSelection onNext={nextStep} onPrev={prevStep} updateFormData={updateFormData} />
      case 3:
        return <UserVerification onNext={nextStep} onPrev={prevStep} updateFormData={updateFormData} />
      case 4:
        return <PriceEstimation onNext={nextStep} onPrev={prevStep} formData={formData} updateFormData={updateFormData} />
      case 5:
        return <PaymentSelection onPrev={prevStep} formData={formData} updateFormData={updateFormData} />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Sell Your Device</h1>
      <div className="mb-8">
        <ol className="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4">
          {steps.map((step, index) => (
            <li key={index} className={`flex items-center ${index <= currentStep ? 'text-blue-600 dark:text-blue-500' : ''}`}>
              <span className={`flex items-center justify-center w-5 h-5 mr-2 text-xs border ${index < currentStep ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-500'} rounded-full shrink-0 dark:border-gray-400`}>
                {index < currentStep ? '✓' : index + 1}
              </span>
              {step}
              {index < steps.length - 1 && (
                <svg aria-hidden="true" className="w-4 h-4 ml-2 sm:ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
              )}
            </li>
          ))}
        </ol>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}