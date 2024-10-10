import { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Buyback Website
          </Link>
          <div className="space-x-4">
            <Button asChild variant="ghost">
              <Link href="/sell">Sell Device</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/about">About</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/contact">Contact</Link>
            </Button>
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-100">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          © 2024 Buyback Website. All rights reserved.
        </div>
      </footer>
    </div>
  )
}