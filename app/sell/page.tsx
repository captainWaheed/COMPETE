"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Cookies from 'js-cookie'
import DeviceSelection from '@/components/DeviceSelection'
import DeviceDetails from '@/components/DeviceDetails'
import PickupParcelSelection from '@/components/PickupParcelSelection'
import UserVerification from '@/components/UserVerification'
import PriceEstimation from '@/components/PriceEstimation'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/use-toast'

const steps = [
  'Device Selection',
  'Device Details',
  'Pickup or Parcel',
  'User Verification',
  'Price Estimation',
]

interface FormData {
  deviceSelection: {
    deviceType?: string;
  };
  deviceDetails: {
    brand?: string;
    model?: string;
    yearOfPurchase?: string;
    condition?: string;
    storage?: string;
    defects?: string[];
    serialNumber?: string;
    images?: File[];
  };
  pickupParcel: {
    deliveryMethod?: 'pickup' | 'parcel';
    pickupDetails?: {
      address?: string;
      preferredDate?: string;
      specialInstructions?: string;
    };
    parcelDetails?: {
      trackingNumber?: string;
      courierName?: string;
    };
  };
  userVerification: {
    fullName?: string;
    idType?: string;
    idNumber?: string;
    cnic?: string;
    email?: string;
    phoneNumber?: string;
    idImage?: File;
  };
  priceEstimation: {
    estimatedPrice?: number;
    status?: 'pending' | 'approved' | 'rejected';
  };
}

export default function SellPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    deviceSelection: {},
    deviceDetails: {},
    pickupParcel: {},
    userVerification: {},
    priceEstimation: {},
  })

  useEffect(() => {
    const savedData = Cookies.get('sellFormData')
    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
    const savedStep = Cookies.get('currentStep')
    if (savedStep) {
      setCurrentStep(parseInt(savedStep))
    }
  }, [])

  const nextStep = () => {
    const newStep = Math.min(currentStep + 1, steps.length - 1)
    setCurrentStep(newStep)
    Cookies.set('currentStep', newStep.toString())
  }

  const prevStep = () => {
    const newStep = Math.max(currentStep - 1, 0)
    setCurrentStep(newStep)
    Cookies.set('currentStep', newStep.toString())
  }

  const updateFormData = (stepData: Partial<FormData[keyof FormData]>, step: keyof FormData) => {
    const updatedData = { ...formData, [step]: { ...formData[step], ...stepData } }
    setFormData(updatedData)
    Cookies.set('sellFormData', JSON.stringify(updatedData))

    // Save to Supabase if it's the final step
    if (currentStep === steps.length - 1) {
      saveToSupabase(updatedData)
    }
  }

  const saveToSupabase = async (data: FormData) => {
    try {
      const { data: savedData, error } = await supabase
        .from('sell_requests')
        .upsert({ ...data, updated_at: new Date() }, { onConflict: 'id' })

      if (error) throw error
      console.log('Data saved to Supabase:', savedData)
      toast({
        title: "Success",
        description: "Your sell request has been submitted successfully!",
      })
      // Reset form and cookies after successful submission
      setFormData({
        deviceSelection: {},
        deviceDetails: {},
        pickupParcel: {},
        userVerification: {},
        priceEstimation: {},
      })
      setCurrentStep(0)
      Cookies.remove('sellFormData')
      Cookies.remove('currentStep')
    } catch (error) {
      console.error('Error saving data to Supabase:', error)
      toast({
        title: "Error",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <DeviceSelection onNext={nextStep} updateFormData={(data) => updateFormData(data, 'deviceSelection')} formData={formData.deviceSelection} />
      case 1:
        return <DeviceDetails 
          onNext={nextStep} 
          onPrev={prevStep} 
          updateFormData={(data) => updateFormData(data, 'deviceDetails')} 
          formData={formData.deviceDetails} 
        />
      case 2:
        return <PickupParcelSelection onNext={nextStep} onPrev={prevStep} updateFormData={(data) => updateFormData(data, 'pickupParcel')} formData={formData.pickupParcel} />
      case 3:
        return <UserVerification onNext={nextStep} onPrev={prevStep} updateFormData={(data) => updateFormData(data, 'userVerification')} formData={formData.userVerification} />
      case 4:
        return <PriceEstimation 
          onNext={() => saveToSupabase(formData)} 
          onPrev={prevStep} 
          formData={formData} 
          updateFormData={(data) => updateFormData(data, 'priceEstimation')} 
        />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
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