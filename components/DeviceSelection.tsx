"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const deviceTypes = ['Smartphone', 'Tablet', 'Laptop']

interface DeviceSelectionProps {
  onNext: () => void
  updateFormData: (data: { deviceType: string }) => void
}

export default function DeviceSelection({ onNext, updateFormData }: DeviceSelectionProps) {
  const [selectedType, setSelectedType] = useState<string>('')

  const handleNext = () => {
    if (selectedType) {
      updateFormData({ deviceType: selectedType })
      onNext()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-primary">Select Device Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={setSelectedType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select device type" />
            </SelectTrigger>
            <SelectContent>
              {deviceTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleNext} 
            disabled={!selectedType}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Next
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}