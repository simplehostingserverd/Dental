"use client"

import { signIn } from "next-auth/react"
import { Heart, Calendar, FileText, Shield, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-800 text-white p-12 flex-col justify-center">
        <div className="max-w-md">
          <div className="flex items-center mb-8">
            <Heart className="h-8 w-8 text-white mr-3" />
            <span className="text-2xl font-bold">DentalCloud</span>
          </div>

          <h1 className="text-3xl font-bold mb-4">
            Next-Gen Dental Practice Management
          </h1>

          <p className="text-slate-300 mb-8">
            HIPAA-compliant cloud platform with AI-powered insights, smart scheduling, and seamless patient care.
          </p>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center mr-4">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Smart Scheduling</h3>
                <p className="text-sm text-slate-300">
                  AI-powered appointment optimization and automated reminders
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center mr-4">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Digital Charting</h3>
                <p className="text-sm text-slate-300">
                  Interactive odontogram with real-time collaboration
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center mr-4">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">HIPAA Compliant</h3>
                <p className="text-sm text-slate-300">
                  Enterprise-grade security and data protection
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600">Sign in to your dental practice account.</p>
          </div>

          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign up
              </a>
            </p>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.5 12.5c0-6.9-5.6-12.5-12.5-12.5S-1.5 5.6-1.5 12.5 4.1 25 11 25c3.2 0 6.2-1.2 8.5-3.5l-3.5-3.5c-1.4 1.4-3.3 2.2-5 2.2-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7h-7v4h11.5z"/>
                </svg>
                <span className="ml-2">Microsoft</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
