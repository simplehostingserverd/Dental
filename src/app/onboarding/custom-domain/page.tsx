"use client";

import { useState } from "react";
import { Check, Globe, Shield, Zap, ArrowRight, Crown, Star, Lock } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    id: 1,
    title: "Domain Configuration",
    description: "Connect your custom domain",
    icon: Globe,
    status: "current"
  },
  {
    id: 2,
    title: "SSL & Security",
    description: "Enterprise-grade security setup",
    icon: Shield,
    status: "upcoming"
  },
  {
    id: 3,
    title: "White-Label Branding",
    description: "Customize your practice branding",
    icon: Crown,
    status: "upcoming"
  },
  {
    id: 4,
    title: "Go Live",
    description: "Launch your custom solution",
    icon: Zap,
    status: "upcoming"
  }
];

export default function CustomDomainOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [domain, setDomain] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const handleDomainValidation = async () => {
    setIsValidating(true);
    // Simulate validation
    setTimeout(() => {
      setIsValidating(false);
      setCurrentStep(2);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Premium Header */}
      <header className="border-b border-purple-800/30 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Cognident Enterprise</h1>
                <p className="text-purple-300">Custom Domain Setup</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 rounded-full bg-purple-600/20 px-4 py-2">
              <Star className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Premium Plan</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                    step.id <= currentStep 
                      ? 'border-purple-500 bg-purple-600 text-white' 
                      : 'border-gray-600 bg-gray-800 text-gray-400'
                  }`}>
                    {step.id < currentStep ? (
                      <Check className="h-8 w-8" />
                    ) : (
                      <step.icon className="h-8 w-8" />
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <p className={`font-semibold ${step.id <= currentStep ? 'text-white' : 'text-gray-400'}`}>
                      {step.title}
                    </p>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`mx-8 h-1 w-24 rounded-full transition-all duration-500 ${
                    step.id < currentStep ? 'bg-purple-600' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-purple-800/30 bg-black/40 backdrop-blur-xl p-8 shadow-2xl">
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-white mb-4">Connect Your Custom Domain</h2>
                  <p className="text-xl text-purple-300">
                    Transform your practice with a fully branded dental management platform
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-white mb-3">
                      Your Practice Domain
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="e.g., dental.yourpractice.com"
                        className="w-full rounded-xl border border-purple-600/30 bg-black/60 px-6 py-4 text-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                      <Globe className="absolute right-4 top-4 h-6 w-6 text-purple-400" />
                    </div>
                  </div>

                  <div className="rounded-xl bg-purple-900/20 border border-purple-700/30 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">What You'll Get:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Custom branded login portal",
                        "Your practice logo & colors",
                        "Dedicated SSL certificate",
                        "Enterprise-grade security",
                        "24/7 premium support",
                        "99.99% uptime guarantee"
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <Check className="h-5 w-5 text-purple-400" />
                          <span className="text-purple-200">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleDomainValidation}
                    disabled={!domain || isValidating}
                    className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isValidating ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Validating Domain...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Continue Setup</span>
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-white mb-4">Enterprise Security Setup</h2>
                  <p className="text-xl text-purple-300">
                    Configuring military-grade security for your practice
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "SSL Certificate",
                      description: "256-bit encryption",
                      icon: Lock,
                      status: "complete"
                    },
                    {
                      title: "HIPAA Compliance",
                      description: "Healthcare security",
                      icon: Shield,
                      status: "complete"
                    },
                    {
                      title: "Data Encryption",
                      description: "End-to-end protection",
                      icon: Lock,
                      status: "processing"
                    }
                  ].map((item, index) => (
                    <div key={index} className="rounded-xl border border-purple-700/30 bg-purple-900/20 p-6 text-center">
                      <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                        item.status === 'complete' ? 'bg-green-600' : 'bg-purple-600'
                      }`}>
                        {item.status === 'complete' ? (
                          <Check className="h-8 w-8 text-white" />
                        ) : (
                          <item.icon className="h-8 w-8 text-white" />
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      <p className="text-purple-300">{item.description}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentStep(3)}
                  className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  Continue to Branding
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-12 text-center">
          <p className="text-purple-300 mb-4">Need assistance with your custom domain setup?</p>
          <Link
            href="/support/enterprise"
            className="inline-flex items-center space-x-2 rounded-xl border border-purple-600 bg-purple-600/10 px-6 py-3 text-purple-300 transition-all duration-300 hover:bg-purple-600/20"
          >
            <span>Contact Enterprise Support</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
