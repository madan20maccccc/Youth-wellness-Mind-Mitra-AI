"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Heart, MessageCircle, Shield, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 to-blue-100/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div
            className={`text-center transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center float-animation pulse-glow">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 text-balance">
              Mind Mitra
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> AI</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto text-pretty">
              Your AI Friend for Mental Wellness
            </p>

            {/* Description */}
            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto text-pretty">
              A safe and confidential space to share your thoughts and feelings. Start a conversation whenever you need
              a friend to listen.
            </p>

            {/* CTA Button */}
            <Link href="/chat">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Start Conversation
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Mind Mitra AI?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience a new way of mental wellness support with our AI companion
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Safe & Confidential",
                description: "Your conversations are private and secure. Share freely in a judgment-free space.",
              },
              {
                icon: Heart,
                title: "Empathetic AI",
                description: "Our AI is trained to understand and respond with empathy and compassion.",
              },
              {
                icon: MessageCircle,
                title: "24/7 Availability",
                description: "Get support whenever you need it. Your AI friend is always here to listen.",
              },
              {
                icon: Sparkles,
                title: "Personalized Care",
                description: "Tailored responses and suggestions based on your unique needs and feelings.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className={`p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to start your wellness journey?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Take the first step towards better mental health with your AI companion
          </p>
          <Link href="/chat">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Begin Your Journey
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
