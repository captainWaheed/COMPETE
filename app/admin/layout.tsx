import React from 'react'
import Sidebar from '@/components/admin/Sidebar'

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
