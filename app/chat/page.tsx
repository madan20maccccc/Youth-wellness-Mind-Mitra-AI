"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Brain, Send, Mic, Home, Smile, Meh, Frown, Heart, Star, Sparkles, Moon, Sun } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
  emotion?: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm Mind Mitra, your AI companion for mental wellness. This is a safe and confidential space for you to share what's on your mind. How are you feeling today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showEmotionPicker, setShowEmotionPicker] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showWellnessTip, setShowWellnessTip] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()

    if (lowerInput.includes("anxious") || lowerInput.includes("worried") || lowerInput.includes("stress")) {
      const anxietyResponses = [
        "I understand you're feeling anxious. Let's take a moment together. Try taking three deep breaths with me. What's one thing you can see, hear, and feel right now?",
        "Anxiety can feel overwhelming, but you're not alone. What usually helps you feel more grounded when you're feeling this way?",
        "Thank you for sharing your anxiety with me. Remember, these feelings are temporary. What's one small thing that might bring you comfort right now?",
      ]
      return anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)]
    }

    if (lowerInput.includes("sad") || lowerInput.includes("down") || lowerInput.includes("depressed")) {
      const sadnessResponses = [
        "I hear that you're feeling sad, and I want you to know that it's okay to feel this way. Your emotions are valid. What's been weighing on your heart?",
        "Sadness can feel heavy. Thank you for trusting me with these feelings. Is there something specific that's been troubling you?",
        "I'm here with you in this difficult moment. Sometimes talking about what's making us sad can help lighten the load. What would you like to share?",
      ]
      return sadnessResponses[Math.floor(Math.random() * sadnessResponses.length)]
    }

    if (lowerInput.includes("happy") || lowerInput.includes("good") || lowerInput.includes("great")) {
      const happyResponses = [
        "I'm so glad to hear you're feeling good! It's wonderful when we can appreciate these positive moments. What's bringing you joy today?",
        "That's beautiful to hear! Happiness is such a gift. Would you like to share what's making you feel this way?",
        "Your positive energy is lovely! It's important to celebrate these good feelings. What's been going well for you?",
      ]
      return happyResponses[Math.floor(Math.random() * happyResponses.length)]
    }

    const generalResponses = [
      "I hear you, and I want you to know that your feelings are valid. Can you tell me more about what's been on your mind?",
      "Thank you for sharing that with me. It takes courage to open up. How has this been affecting your daily life?",
      "I'm here to listen without judgment. What would help you feel more supported right now?",
      "That sounds challenging. Remember that it's okay to feel this way. What are some things that usually bring you comfort?",
      "I appreciate you trusting me with your thoughts. What's one small step you could take today to care for yourself?",
    ]
    return generalResponses[Math.floor(Math.random() * generalResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentInput }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response")
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])

      // Show wellness tip occasionally
      if (Math.random() < 0.3) {
        setTimeout(() => setShowWellnessTip(true), 2000)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please check your API configuration and try again.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleEmotionSelect = (emotion: string) => {
    const emotionMessage: Message = {
      id: Date.now().toString(),
      text: `I'm feeling ${emotion} right now.`,
      sender: "user",
      timestamp: new Date(),
      emotion,
    }
    setMessages((prev) => [...prev, emotionMessage])
    setShowEmotionPicker(false)
    setIsTyping(true)

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `I understand you're feeling ${emotion}. Thank you for sharing that with me. Would you like to talk about what's contributing to these feelings?`,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const emotions = [
    { name: "happy", icon: Smile, color: "text-green-500", bgColor: "hover:bg-green-50" },
    { name: "neutral", icon: Meh, color: "text-yellow-500", bgColor: "hover:bg-yellow-50" },
    { name: "sad", icon: Frown, color: "text-blue-500", bgColor: "hover:bg-blue-50" },
    { name: "anxious", icon: Heart, color: "text-red-500", bgColor: "hover:bg-red-50" },
    { name: "grateful", icon: Star, color: "text-purple-500", bgColor: "hover:bg-purple-50" },
  ]

  const wellnessTips = [
    "💡 Tip: Try the 5-4-3-2-1 grounding technique - name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.",
    "🌱 Remember: It's okay to take breaks. Your mental health is just as important as your physical health.",
    "✨ Practice: Take 3 deep breaths. Inhale for 4 counts, hold for 4, exhale for 6. This activates your body's relaxation response.",
    "🌟 Reminder: You've overcome challenges before, and you have the strength to overcome this one too.",
    "💙 Self-care: Drink some water, stretch your body, or step outside for a moment of fresh air.",
  ]

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${isDarkMode ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" : "bg-gradient-to-br from-purple-50 via-white to-blue-50"}`}
    >
      {/* Header */}
      <div
        className={`backdrop-blur-sm border-b sticky top-0 z-10 transition-colors duration-300 ${isDarkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-gray-200"}`}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center float-animation">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Mind Mitra AI</h1>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Your AI wellness companion</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm" className={isDarkMode ? "text-gray-300 hover:text-white" : ""}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6 mb-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} message-slide-in`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={`flex items-start space-x-3 max-w-xs md:max-w-md lg:max-w-lg ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback
                    className={
                      message.sender === "user"
                        ? isDarkMode
                          ? "bg-slate-700 text-white"
                          : "bg-gray-200"
                        : "bg-gradient-to-br from-purple-500 to-blue-500 text-white"
                    }
                  >
                    {message.sender === "user" ? "U" : <Brain className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <Card
                  className={`p-4 shadow-sm hover:shadow-md transition-all duration-300 ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      : isDarkMode
                        ? "bg-slate-800 text-gray-100 border-slate-700"
                        : "bg-white"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  {message.emotion && (
                    <div className="mt-2 flex items-center space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full opacity-50" />
                      <span className="text-xs opacity-75">Feeling {message.emotion}</span>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start message-slide-in">
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                    <Brain className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <Card className={`p-4 shadow-sm ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white"}`}>
                  <div className="flex space-x-1">
                    <div className={`w-2 h-2 rounded-full typing-dot ${isDarkMode ? "bg-gray-400" : "bg-gray-400"}`} />
                    <div className={`w-2 h-2 rounded-full typing-dot ${isDarkMode ? "bg-gray-400" : "bg-gray-400"}`} />
                    <div className={`w-2 h-2 rounded-full typing-dot ${isDarkMode ? "bg-gray-400" : "bg-gray-400"}`} />
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {showWellnessTip && (
        <div className="fixed top-20 right-4 z-40 max-w-sm">
          <Card
            className={`p-4 shadow-lg border-l-4 border-l-purple-500 ${isDarkMode ? "bg-slate-800 text-gray-100" : "bg-white"} message-slide-in`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2">
                <Sparkles className="w-5 h-5 text-purple-500 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  {wellnessTips[Math.floor(Math.random() * wellnessTips.length)]}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowWellnessTip(false)} className="ml-2 h-6 w-6 p-0">
                ×
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Emotion Picker */}
      {showEmotionPicker && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className={`p-6 max-w-sm w-full ${isDarkMode ? "bg-slate-800 text-gray-100" : "bg-white"}`}>
            <h3 className="text-lg font-semibold mb-4 text-center">How are you feeling?</h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {emotions.map((emotion) => (
                <Button
                  key={emotion.name}
                  variant="ghost"
                  className={`flex flex-col items-center space-y-2 h-auto py-4 transition-all duration-200 ${emotion.bgColor} ${isDarkMode ? "hover:bg-slate-700" : ""}`}
                  onClick={() => handleEmotionSelect(emotion.name)}
                >
                  <emotion.icon className={`w-6 h-6 ${emotion.color}`} />
                  <span className="text-xs capitalize">{emotion.name}</span>
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              className={`w-full ${isDarkMode ? "border-slate-600 hover:bg-slate-700" : "bg-transparent"}`}
              onClick={() => setShowEmotionPicker(false)}
            >
              Cancel
            </Button>
          </Card>
        </div>
      )}

      {/* Input Area */}
      <div
        className={`fixed bottom-0 left-0 right-0 backdrop-blur-sm border-t p-4 transition-colors duration-300 ${isDarkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-gray-200"}`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-2 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmotionPicker(true)}
              className={`transition-colors ${isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Smile className="w-4 h-4 mr-1" />
              Mood
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Share what's on your mind..."
                className={`pr-12 transition-colors ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-400"
                    : "bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                }`}
              />
              <Button
                size="sm"
                variant="ghost"
                className={`absolute right-1 top-1/2 -translate-y-1/2 transition-colors ${
                  isRecording
                    ? "text-red-500"
                    : isDarkMode
                      ? "text-gray-400 hover:text-gray-200"
                      : "text-gray-400 hover:text-gray-600"
                }`}
                onClick={() => setIsRecording(!isRecording)}
              >
                <Mic className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom padding to account for fixed input */}
      <div className="h-32" />
    </div>
  )
}
