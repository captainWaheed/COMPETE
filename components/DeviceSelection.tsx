"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

interface DeviceSelectionProps {
  onNext: (deviceType: string) => void
}

export default function DeviceSelection({ onNext }: DeviceSelectionProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const handleSelect = (type: string) => {
    setSelectedType(type)
    onNext(type)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto px-4"
    >
      <h1 className="text-3xl font-bold text-center mb-4">Let's get started. The process is simple.</h1>
      <p className="text-center mb-8">First, please select the device you want to sell.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
            selectedType === 'smartphone' ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => handleSelect('smartphone')}
        >
          <CardContent className="flex flex-col items-center p-6">
            <h2 className="text-xl font-semibold mb-4">Smartphone</h2>
            <Image
              src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXBob25lfGVufDB8fDB8fHww"
              alt="Smartphone"
              width={200}
              height={200}
              className="rounded-lg object-cover"
            />
          </CardContent>
        </Card>
        <Card 
          className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
            selectedType === 'tablet' ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => handleSelect('tablet')}
        >
          <CardContent className="flex flex-col items-center p-6">
            <h2 className="text-xl font-semibold mb-4">Tablet</h2>
            <Image
              src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aXBhZHxlbnwwfHwwfHx8MA%3D%3D"
              alt="Tablet"
              width={200}
              height={200}
              className="rounded-lg object-cover"
            />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}