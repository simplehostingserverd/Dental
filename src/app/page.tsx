import { Metadata } from 'next';
import Link from 'next/link';
import {
  Calendar,
  FileText,
  Heart,
  Shield,
  Users,
  BarChart3,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Play
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cognident - Next-Gen Dental Practice Management Software',
  description: 'HIPAA-compliant cloud platform with AI-powered insights, smart scheduling, and seamless patient care. Transform your dental practice with our comprehensive management solution.',
  keywords: 'dental practice management, dental software, HIPAA compliant, dental scheduling, patient management, dental charting, dental billing',
  openGraph: {
    title: 'Cognident - Next-Gen Dental Practice Management Software',
    description: 'Transform your dental practice with our comprehensive management platform featuring AI-powered insights and smart scheduling.',
    type: 'website',
    url: 'https://cognident.org',
    images: [
      {
        url: 'https://cognident.org/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cognident - Dental Practice Management Software',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cognident - Next-Gen Dental Practice Management Software',
    description: 'Transform your dental practice with our comprehensive management platform.',
    images: ['https://cognident.org/og-image.jpg'],
  },
};

export default function LandingPage() {
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Cognident",
    "description": "HIPAA-compliant cloud platform with AI-powered insights, smart scheduling, and seamless patient care for dental practices.",
    "url": "https://cognident.org",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "14-day free trial"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "2000"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-400 mr-3" />
              <span className="font-bold text-xl">Cognident</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                Blog
              </Link>
              <Link href="#contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
              <Link
                href="/auth/signin"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Next-Gen Dental Practice
                <span className="text-blue-400"> Management</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                HIPAA-compliant cloud platform with AI-powered insights, smart scheduling,
                and seamless patient care. Transform your practice with our comprehensive management solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <button className="border border-gray-600 hover:border-gray-500 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </button>
              </div>
              <div className="mt-8 flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  14-day free trial
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  HIPAA compliant
                </div>
              </div>
            </div>
            <div className="relative">
              <div
                className="rounded-lg overflow-hidden shadow-2xl"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '400px'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything Your Practice Needs
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Streamline operations, improve patient care, and grow your practice with our comprehensive suite of tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Smart Scheduling",
                description: "AI-powered appointment optimization with automated reminders and conflict resolution."
              },
              {
                icon: FileText,
                title: "Digital Charting",
                description: "Interactive odontogram with real-time collaboration and comprehensive treatment planning."
              },
              {
                icon: Shield,
                title: "HIPAA Compliant",
                description: "Enterprise-grade security with encrypted data storage and secure patient communications."
              },
              {
                icon: Users,
                title: "Patient Management",
                description: "Complete patient profiles with treatment history, insurance, and communication preferences."
              },
              {
                icon: BarChart3,
                title: "Analytics & Reports",
                description: "Detailed insights into practice performance, revenue tracking, and growth opportunities."
              },
              {
                icon: Clock,
                title: "24/7 Support",
                description: "Round-the-clock technical support and training to keep your practice running smoothly."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors">
                <feature.icon className="h-12 w-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Trusted by Dental Practices Worldwide
            </h2>
            <div className="flex justify-center items-center space-x-2 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
              <span className="ml-2 text-lg text-gray-300">4.9/5 from 2,000+ practices</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "DentalCloud transformed our practice efficiency. We've reduced scheduling conflicts by 90% and improved patient satisfaction significantly.",
                author: "Dr. Sarah Johnson",
                practice: "Smile Dental Clinic"
              },
              {
                quote: "The AI-powered insights helped us identify revenue opportunities we never knew existed. Our practice revenue increased by 35% in the first year.",
                author: "Dr. Michael Chen",
                practice: "Pacific Dental Group"
              },
              {
                quote: "HIPAA compliance was our biggest concern, but DentalCloud made it seamless. The security features give us and our patients peace of mind.",
                author: "Dr. Emily Rodriguez",
                practice: "Downtown Dental Care"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg">
                <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-gray-400 text-sm">{testimonial.practice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of dental practices already using DentalCloud to streamline operations and improve patient care.
          </p>
          <Link
            href="/auth/signup"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center"
          >
            Start Your Free Trial Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-blue-400 mr-3" />
                <span className="font-bold text-xl">DentalCloud</span>
              </div>
              <p className="text-gray-400">
                Next-generation dental practice management software designed for modern practices.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API Docs</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DentalCloud. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
