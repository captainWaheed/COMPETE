'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Users, 
  MessageSquare, 
  DollarSign, 
  CheckSquare, 
  BarChart2,
  Menu,
  X
} from 'lucide-react'

const navItems = [
  { name: 'User Requests', href: '/admin/requests', icon: Users },
  { name: 'Chat', href: '/admin/chat', icon: MessageSquare },
  { name: 'Price Finalization', href: '/admin/price-finalization', icon: DollarSign },
  { name: 'Details Confirmation', href: '/admin/details-confirmation', icon: CheckSquare },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <div 
        className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition duration-200 ease-in-out z-30`}
      >
        <h2 className="text-2xl font-semibold text-center">Admin Dashboard</h2>
        <nav>
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className={`block py-2.5 px-4 rounded transition duration-200 ${
                pathname === item.href ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </div>
            </Link>
          ))}
        </nav>
      </div>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}