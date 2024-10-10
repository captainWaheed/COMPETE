"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Define the type for a transaction
interface Transaction {
  id: string
  device_type: string
  brand: string
  model: string
  user_name: string
  estimated_price: number
  status: string
  // Add any other fields that your transaction object has
}

export default function AdminDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState({
    totalDevices: 0,
    pendingRequests: 0,
    averagePrice: 0,
  })

  useEffect(() => {
    fetchTransactions()
    fetchStats()
  }, [])

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching transactions:', error)
    } else {
      setTransactions(data as Transaction[])
    }
  }

  const fetchStats = async () => {
    const { data: devicesData, error: devicesError } = await supabase
      .from('devices')
      .select('count', { count: 'exact' })

    const { data: pendingData, error: pendingError } = await supabase
      .from('transactions')
      .select('count', { count: 'exact' })
      .eq('status', 'pending')

    const { data: priceData, error: priceError } = await supabase
      .from('transactions')
      .select('estimated_price')

    if (devicesError || pendingError || priceError) {
      console.error('Error fetching stats:', devicesError || pendingError || priceError)
    } else {
      const totalDevices = devicesData[0].count
      const pendingRequests = pendingData[0].count
      const averagePrice = priceData.reduce((sum, transaction) => sum + transaction.estimated_price, 0) / priceData.length

      setStats({
        totalDevices,
        pendingRequests,
        averagePrice: averagePrice.toFixed(2),
      })
    }
  }

  const handleApprove = async (id) => {
    const { error } = await supabase
      .from('transactions')
      .update({ status: 'approved' })
      .eq('id', id)

    if (error) {
      console.error('Error approving transaction:', error)
    } else {
      fetchTransactions()
      fetchStats()
    }
  }

  const handleReject = async (id) => {
    const { error } = await supabase
      .from('transactions')
      .update({ status: 'rejected' })
      .eq('id', id)

    if (error) {
      console.error('Error rejecting transaction:', error)
    } else {
      fetchTransactions()
      fetchStats()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.totalDevices}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.pendingRequests}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Price</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">${stats.averagePrice}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Device Sales by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'Smartphone', sales: 120 },
              { name: 'Tablet', sales: 80 },
              { name: 'Laptop', sales: 100 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.id}</TableCell>
              <TableCell>{transaction.device_type} - {transaction.brand} {transaction.model}</TableCell>
              <TableCell>{transaction.user_name}</TableCell>
              <TableCell>${transaction.estimated_price}</TableCell>
              <TableCell>{transaction.status}</TableCell>
              <TableCell>
                <Button onClick={() => handleApprove(transaction.id)} className="mr-2">
                  Approve
                </Button>
                <Button onClick={() => handleReject(transaction.id)} variant="destructive">
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}