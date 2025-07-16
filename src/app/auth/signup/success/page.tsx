"use client"

import { Heart, CheckCircle, Mail, Calendar, Users, Settings } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <Heart className="h-12 w-12 text-blue-600 mr-3" />
            <span className="text-3xl font-bold text-gray-900">DentalCloud</span>
          </div>
          
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to DentalCloud!
          </h1>
          <p className="text-lg text-gray-600">
            Your account has been created successfully. Let's get your practice set up.
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Next Steps</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Check Your Email</h3>
                <p className="text-sm text-gray-600">
                  We've sent a verification email to your work email address. Please click the link to verify your account.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Settings className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Complete Practice Setup</h3>
                <p className="text-sm text-gray-600">
                  Add your practice details, locations, and configure your preferences.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Invite Your Team</h3>
                <p className="text-sm text-gray-600">
                  Add dentists, hygienists, and staff members to your practice.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <Calendar className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Schedule Demo</h3>
                <p className="text-sm text-gray-600">
                  Book a personalized demo to learn about advanced features and best practices.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trial Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2">Your 30-Day Free Trial</h3>
          <p className="text-sm text-blue-800 mb-4">
            You have full access to all DentalCloud features for the next 30 days. No credit card required.
          </p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Complete EMR and practice management suite</li>
            <li>• AI-powered scheduling and insights</li>
            <li>• Patient portal and communication tools</li>
            <li>• Digital imaging and charting</li>
            <li>• Billing and insurance management</li>
            <li>• 24/7 customer support</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Dashboard
          </Link>
          
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Start Setup Wizard
          </Link>
          
          <Link
            href="/demo"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Schedule Demo
          </Link>
        </div>

        {/* Support */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Need help getting started?{" "}
            <Link href="/support" className="text-blue-600 hover:text-blue-500">
              Contact our support team
            </Link>{" "}
            or{" "}
            <Link href="/help" className="text-blue-600 hover:text-blue-500">
              visit our help center
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
