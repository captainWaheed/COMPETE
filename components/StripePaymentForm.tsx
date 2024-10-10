"use client"

import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

export default function StripePaymentForm({ amount, onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    })

    if (error) {
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive",
      })
    } else {
      onSuccess()
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button type="submit" disabled={!stripe || isLoading} className="mt-4">
        {isLoading ? 'Processing...' : `Pay $${amount}`}
      </Button>
    </form>
  )
}