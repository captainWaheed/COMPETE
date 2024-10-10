import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, DollarSign, Recycle } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Get Top Dollar for Your Tech
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Sell your devices with ease and get the best value for your smartphones, tablets, and laptops.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild size="lg">
            <Link href="/sell">Sell Your Device <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white w-full py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<DollarSign className="h-12 w-12 text-primary" />}
              title="Best Prices"
              description="We offer competitive prices for your devices, ensuring you get the most value."
            />
            <FeatureCard 
              icon={<CheckCircle className="h-12 w-12 text-primary" />}
              title="Easy Process"
              description="Our streamlined selling process makes it quick and hassle-free to sell your devices."
            />
            <FeatureCard 
              icon={<Recycle className="h-12 w-12 text-primary" />}
              title="Eco-Friendly"
              description="By selling your old devices, you're contributing to electronic waste reduction."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Sell?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          It only takes a few minutes to get an offer for your device. Start the process now!
        </p>
        <Button asChild size="lg">
          <Link href="/sell">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
        </Button>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
      {icon}
      <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}