import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useDropzone } from 'react-dropzone'
import { storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const brands = {
  Apple: ['iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13 Pro', 'iPhone 13'],
  Samsung: ['Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23', 'Galaxy S22 Ultra', 'Galaxy S22+']
}

const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB']

const modelYears = {
  'iPhone 14 Pro Max': [2022, 2023],
  'iPhone 14 Pro': [2022, 2023],
  'iPhone 14': [2022, 2023],
  'iPhone 13 Pro': [2021, 2022],
  'iPhone 13': [2021, 2022],
  'Galaxy S23 Ultra': [2023],
  'Galaxy S23+': [2023],
  'Galaxy S23': [2023],
  'Galaxy S22 Ultra': [2022],
  'Galaxy S22+': [2022]
}

const handleImageUpload = async (file: File) => {
  try {
    const storageRef = ref(storage, `device-images/${file.name}`)
    await uploadBytes(storageRef, file)
    return await getDownloadURL(storageRef)
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error("Failed to upload image. Please try again.")
  }
}

export default function DeviceDetails({ onNext, onPrev, updateFormData, formData }) {
  const [deviceDetails, setDeviceDetails] = useState({
    brand: formData.brand || '',
    model: formData.model || '',
    yearOfPurchase: formData.yearOfPurchase || '',
    condition: formData.condition || 'used',
    storage: formData.storage || '',
    defects: formData.defects || [],
    serialNumber: formData.serialNumber || '',
    images: formData.images || [],
    estimatedPrice: formData.estimatedPrice || 0
  })

  const [availableModels, setAvailableModels] = useState([])
  const [availableYears, setAvailableYears] = useState([])

  useEffect(() => {
    if (deviceDetails.brand) {
      setAvailableModels(brands[deviceDetails.brand])
    }
  }, [deviceDetails.brand])

  useEffect(() => {
    if (deviceDetails.model) {
      setAvailableYears(modelYears[deviceDetails.model] || [])
    }
  }, [deviceDetails.model])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setDeviceDetails(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setDeviceDetails(prev => ({ ...prev, [name]: value }))
  }

  const handleDefectChange = (defect) => {
    setDeviceDetails(prev => ({
      ...prev,
      defects: prev.defects.includes(defect)
        ? prev.defects.filter(d => d !== defect)
        : [...prev.defects, defect]
    }))
  }

  const onDrop = (acceptedFiles) => {
    setDeviceDetails(prev => ({
      ...prev,
      images: [...prev.images, ...acceptedFiles].slice(0, 3)
    }))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxFiles: 3,
    maxSize: 5000000 // 5MB
  })

  const removeImage = (index) => {
    setDeviceDetails(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const calculateEstimatedPrice = () => {
    let basePrice = 1000 // Starting base price

    // Adjust price based on brand and model
    if (deviceDetails.brand === 'Apple') {
      basePrice += 200
    } else if (deviceDetails.brand === 'Samsung') {
      basePrice += 150
    }

    // Adjust price based on condition
    if (deviceDetails.condition === 'new') {
      basePrice *= 1.2
    } else if (deviceDetails.condition === 'damaged') {
      basePrice *= 0.6
    }

    // Adjust price based on storage
    const storageIndex = storageOptions.indexOf(deviceDetails.storage)
    basePrice += storageIndex * 50

    // Reduce price for each defect
    basePrice -= deviceDetails.defects.length * 50

    // Adjust price based on year of purchase
    const currentYear = new Date().getFullYear()
    const age = currentYear - parseInt(deviceDetails.yearOfPurchase)
    basePrice -= age * 50

    return Math.max(basePrice, 0) // Ensure price doesn't go below 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const estimatedPrice = calculateEstimatedPrice()
    const updatedDetails = { ...deviceDetails, estimatedPrice }

    try {
      // Upload images to Firebase Storage
      const imageUrls = await Promise.all(
        updatedDetails.images.map(async (file) => {
          if (file instanceof File) {
            return await handleImageUpload(file)
          }
          return file
        })
      )

      const finalDetails = { ...updatedDetails, images: imageUrls }
      setDeviceDetails(finalDetails)
      updateFormData(finalDetails)
      onNext()
    } catch (error) {
      console.error('Error uploading images:', error)
      // Handle the error here, e.g., show an error message to the user
      // You can use setState to update an error message state and display it in the UI
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Select
                name="brand"
                value={deviceDetails.brand}
                onValueChange={(value) => handleSelectChange('brand', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(brands).map((brand) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select
                name="model"
                value={deviceDetails.model}
                onValueChange={(value) => handleSelectChange('model', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((model) => (
                    <SelectItem key={model} value={model}>{model}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearOfPurchase">Year of Purchase</Label>
              <Select
                name="yearOfPurchase"
                value={deviceDetails.yearOfPurchase}
                onValueChange={(value) => handleSelectChange('yearOfPurchase', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <RadioGroup
                name="condition"
                value={deviceDetails.condition}
                onValueChange={(value) => handleSelectChange('condition', value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new" />
                  <Label htmlFor="new">New</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="used" id="used" />
                  <Label htmlFor="used">Used</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="damaged" id="damaged" />
                  <Label htmlFor="damaged">Damaged</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="storage">Storage Capacity</Label>
              <Select
                name="storage"
                value={deviceDetails.storage}
                onValueChange={(value) => handleSelectChange('storage', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select storage capacity" />
                </SelectTrigger>
                <SelectContent>
                  {storageOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Defects</Label>
            <div className="grid grid-cols-2 gap-2">
              {['Screen cracks', 'Battery issues', 'Malfunctioning buttons', 'Water damage', 'Other'].map((defect) => (
                <div key={defect} className="flex items-center space-x-2">
                  <Checkbox
                    id={defect}
                    checked={deviceDetails.defects.includes(defect)}
                    onCheckedChange={() => handleDefectChange(defect)}
                  />
                  <label htmlFor={defect}>{defect}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Upload Images (Max 3)</Label>
            <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer">
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the images here ...</p>
              ) : (
                <p>Drag 'n' drop some images here, or click to select images</p>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {deviceDetails.images.map((file, index) => (
                <div key={index} className="relative">
                  <Image
                    src={file instanceof File ? URL.createObjectURL(file) : file}
                    alt={`Uploaded image ${index + 1}`}
                    width={100}
                    height={100}
                    className="object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serialNumber">Serial Number / IMEI</Label>
            <Input
              id="serialNumber"
              name="serialNumber"
              value={deviceDetails.serialNumber}
              onChange={handleInputChange}
              placeholder="Enter device serial number or IMEI"
              required
            />
          </div>

          <div className="flex justify-between">
            <Button type="button" onClick={onPrev} variant="outline">
              Previous
            </Button>
            <Button type="submit">
              Get Estimated Price
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}