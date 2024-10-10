"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data
const userRequests = [
  {
    id: 1,
    user: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
    },
    device: {
      brand: "Apple",
      model: "iPhone 12",
      storage: "128GB",
      defects: ["Cracked screen", "Battery issues"],
      condition: "used",
      serialNumber: "ABCD1234EFGH5678",
    },
    estimatedPrice: 350,
    verificationStatus: "pending",
  },
  {
    id: 2,
    user: {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1987654321",
    },
    device: {
      brand: "Samsung",
      model: "Galaxy S21",
      storage: "256GB",
      defects: ["Minor scratches"],
      condition: "used",
      serialNumber: "WXYZ9876LMNO5432",
    },
    estimatedPrice: 450,
    verificationStatus: "verified",
  },
  // Add more mock data as needed
];

export default function UserRequestsPage() {
  const [expandedRequest, setExpandedRequest] = useState<number | null>(null);

  const toggleRequest = (id: number) => {
    setExpandedRequest(expandedRequest === id ? null : id);
  };

  const handleVerify = (id: number) => {
    console.log(`Verify request ${id}`);
    // Implement verification logic here
  };

  const handleReject = (id: number) => {
    console.log(`Reject request ${id}`);
    // Implement rejection logic here
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Requests</h1>
      <div className="grid gap-6">
        <AnimatePresence>
          {userRequests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Request #{request.id} - {request.user.name}
                  </CardTitle>
                  <Badge
                    variant={
                      request.verificationStatus === "verified"
                        ? "default"
                        : request.verificationStatus === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {request.verificationStatus}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {request.device.brand} {request.device.model} -{" "}
                        {request.device.storage}
                      </p>
                      <p className="text-2xl font-bold">
                        ${request.estimatedPrice}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRequest(request.id)}
                    >
                      {expandedRequest === request.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      <span className="sr-only">Toggle request details</span>
                    </Button>
                  </div>
                  <AnimatePresence>
                    {expandedRequest === request.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 space-y-2"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-semibold">User Details</h3>
                            <p>Email: {request.user.email}</p>
                            <p>Phone: {request.user.phone}</p>
                          </div>
                          <div>
                            <h3 className="font-semibold">Device Details</h3>
                            <p>Condition: {request.device.condition}</p>
                            <p>Serial Number: {request.device.serialNumber}</p>
                            <p>Defects: {request.device.defects.join(", ")}</p>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button
                            size="sm"
                            onClick={() => handleVerify(request.id)}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(request.id)}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
