"use client"

import { useState, useEffect } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import stripePromise from '@/lib/stripe'
import StripePaymentForm from '@/components/StripePaymentForm'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

export default function PaymentSelection({ onPrev, formData }) {
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: formData.estimatedPrice }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
  }, [formData.estimatedPrice])

  const handlePaymentSuccess = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...formData,
          status: 'paid',
        })

      if (error) {
        throw error
      }

      toast({
        title: "Success!",
        description: "Your payment has been processed and your device sale is complete.",
      })
    } catch (error) {
      console.error('Error recording transaction:', error)
      toast({
        title: "Error",
        description: "There was a problem recording your transaction. Please contact support.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Payment</h2>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripePaymentForm amount={formData.estimatedPrice} onSuccess={handlePaymentSuccess} />
        </Elements>
      )}
      <Button variant="outline" onClick={onPrev}>
        Previous
      </Button>
    </div>
  )
}