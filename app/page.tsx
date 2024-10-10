import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold mb-8">
          Welcome to the Buyback Website
        </h1>
        <p className="text-xl mb-8">
          Sell your devices with ease and get the best value for your tech.
        </p>
        <div className="flex space-x-4">
          <Button asChild>
            <Link href="/sell">Sell Your Device</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}