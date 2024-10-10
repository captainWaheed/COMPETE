"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DiJqueryLogo } from "react-icons/di";
import { CreditCard, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PaymentMethod {
  type: string;
  cardholderName?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
}

export default function DeviceDetails() {
  const [selectedMethod, setSelectedMethod] = useState("credit-card");
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<
    PaymentMethod[]
  >([]);

  const paymentMethods = [
    { id: "credit-card", name: "Credit Card", icon: CreditCard },
    { id: "apple-pay", name: "Apple Pay", icon: Apple },
    { id: "paypal", name: "PayPal", icon: DiJqueryLogo },
  ];

  const productDetails = {
    name: "Premium Wireless Headphones",
    price: 199.99,
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const groups = digits.match(/(\d{1,4})/g);
    return groups ? groups.join(" ") : "";
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      setCardNumber(formatted);
    }
  };

  const validateCardNumber = (value: string) => {
    return /^[\d\s]{13,19}$/.test(value.replace(/\s/g, ""));
  };

  const validateExpiry = (value: string) => {
    return /^(0[1-9]|1[0-2])\/\d{2}$/.test(value);
  };

  const validateCVV = (value: string) => {
    return /^\d{3,4}$/.test(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPaymentMethod: PaymentMethod = {
      type: selectedMethod,
    };

    if (selectedMethod === "credit-card") {
      newPaymentMethod.cardholderName = cardholderName;
      newPaymentMethod.cardNumber = cardNumber;
      newPaymentMethod.expiry = expiry;
      newPaymentMethod.cvv = cvv;
    }

    setSavedPaymentMethods([...savedPaymentMethods, newPaymentMethod]);

    // Reset form fields
    setCardholderName("");
    setCardNumber("");
    setExpiry("");
    setCvv("");

    console.log("Payment method saved:", newPaymentMethod);
    console.log("All saved payment methods:", [
      ...savedPaymentMethods,
      newPaymentMethod,
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>Complete your purchase</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 p-4 bg-primary/10 rounded-lg"
          >
            <h3 className="font-semibold text-lg mb-2">
              {productDetails.name}
            </h3>
            <p className="text-2xl font-bold">
              ${productDetails.price.toFixed(2)}
            </p>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <RadioGroup
              defaultValue="credit-card"
              onValueChange={setSelectedMethod}
              className="grid grid-cols-3 gap-4 mb-6"
            >
              {paymentMethods.map((method) => (
                <div key={method.id}>
                  <RadioGroupItem
                    value={method.id}
                    id={method.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={method.id}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <method.icon className="mb-3 h-6 w-6" />
                    {method.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMethod}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {selectedMethod === "credit-card" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardholderName">Cardholder Name</Label>
                      <Input
                        id="cardholderName"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        required
                        maxLength={19}
                        title="Please enter a valid credit card number"
                      />
                      {cardNumber && !validateCardNumber(cardNumber) && (
                        <p className="text-red-500 text-sm">
                          Please enter a valid card number
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="MM/YY"
                          required
                          pattern="(0[1-9]|1[0-2])\/\d{2}"
                          title="Please enter a valid expiry date (MM/YY)"
                        />
                        {expiry && !validateExpiry(expiry) && (
                          <p className="text-red-500 text-sm">
                            Please enter a valid expiry date
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="123"
                          required
                          pattern="\d{3,4}"
                          title="Please enter a valid CVV (3-4 digits)"
                        />
                        {cvv && !validateCVV(cvv) && (
                          <p className="text-red-500 text-sm">
                            Please enter a valid CVV
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {selectedMethod === "apple-pay" && (
                  <div className="text-center">
                    <p>Click the button below to pay with Apple Pay</p>
                    <Button
                      type="button"
                      className="mt-4 bg-black text-white hover:bg-gray-800"
                    >
                      <Apple className="mr-2 h-4 w-4" /> Pay with Apple Pay
                    </Button>
                  </div>
                )}
                {selectedMethod === "paypal" && (
                  <div className="text-center">
                    <p>Click the button below to pay with PayPal</p>
                    <Button
                      type="button"
                      className="mt-4 bg-blue-500 text-white hover:bg-blue-600"
                    >
                      <DiJqueryLogo className="mr-2 h-4 w-4" /> Pay with PayPal
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" onClick={handleSubmit}>
            Save Payment method
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}