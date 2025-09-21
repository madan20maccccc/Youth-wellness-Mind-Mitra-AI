"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Brain, Send, Mic, Home, Smile, Meh, Frown, Heart, Star, Volume2, VolumeX } from "lucide-react"
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
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/wav" })
        // Convert speech to text (simplified - in real app you'd use speech recognition API)
        setInputValue("Voice message recorded") // Placeholder - replace with actual speech-to-text
        stream.getTracks().forEach((track) => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setAudioChunks(chunks)
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Please allow microphone access to use voice recording")
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const speakText = (text: string, messageId: string) => {
    if ("speechSynthesis" in window) {
      // Stop any current speech
      window.speechSynthesis.cancel()

      if (speakingMessageId === messageId) {
        // If already speaking this message, stop it
        setSpeakingMessageId(null)
        setIsSpeaking(false)
        return
      }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onstart = () => {
        setIsSpeaking(true)
        setSpeakingMessageId(messageId)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        setSpeakingMessageId(null)
      }

      utterance.onerror = () => {
        setIsSpeaking(false)
        setSpeakingMessageId(null)
      }

      window.speechSynthesis.speak(utterance)
    } else {
      alert("Text-to-speech is not supported in your browser")
    }
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
    setInputValue("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputValue }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Chat error:", error)
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorResponse])
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
    { name: "happy", icon: Smile, color: "text-green-500" },
    { name: "neutral", icon: Meh, color: "text-yellow-500" },
    { name: "sad", icon: Frown, color: "text-blue-500" },
    { name: "anxious", icon: Heart, color: "text-red-500" },
    { name: "grateful", icon: Star, color: "text-purple-500" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Mind Mitra AI</h1>
              <p className="text-sm text-gray-500">Your AI wellness companion</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6 mb-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} message-slide-in`}
            >
              <div
                className={`flex items-start space-x-3 max-w-xs md:max-w-md lg:max-w-lg ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback
                    className={
                      message.sender === "user"
                        ? "bg-gray-200"
                        : "bg-gradient-to-br from-purple-500 to-blue-500 text-white"
                    }
                  >
                    {message.sender === "user" ? "U" : <Brain className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-2">
                  <Card
                    className={`p-4 ${message.sender === "user" ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" : "bg-white"} shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    {message.emotion && (
                      <div className="mt-2 flex items-center space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full opacity-50" />
                        <span className="text-xs opacity-75">Feeling {message.emotion}</span>
                      </div>
                    )}
                  </Card>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakText(message.text, message.id)}
                    className={`self-start w-8 h-8 p-0 ${message.sender === "user" ? "self-end" : ""} ${speakingMessageId === message.id ? "text-blue-500" : "text-gray-400"} hover:text-gray-600`}
                  >
                    {speakingMessageId === message.id ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
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
                <Card className="p-4 bg-white shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Emotion Picker */}
      {showEmotionPicker && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">How are you feeling?</h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {emotions.map((emotion) => (
                <Button
                  key={emotion.name}
                  variant="ghost"
                  className="flex flex-col items-center space-y-2 h-auto py-4 hover:bg-gray-50"
                  onClick={() => handleEmotionSelect(emotion.name)}
                >
                  <emotion.icon className={`w-6 h-6 ${emotion.color}`} />
                  <span className="text-xs capitalize">{emotion.name}</span>
                </Button>
              ))}
            </div>
            <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowEmotionPicker(false)}>
              Cancel
            </Button>
          </Card>
        </div>
      )}

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-2 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmotionPicker(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Smile className="w-4 h-4 mr-1" />
              Mood
            </Button>
            {isRecording && (
              <div className="flex items-center space-x-2 text-red-500 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Recording...
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Share what's on your mind..."
                className="pr-12 bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-200"
              />
              <Button
                size="sm"
                variant="ghost"
                className={`absolute right-1 top-1/2 -translate-y-1/2 ${isRecording ? "text-red-500 bg-red-50" : "text-gray-400"} hover:text-gray-600`}
                onClick={toggleRecording}
              >
                <Mic className={`w-4 h-4 ${isRecording ? "animate-pulse" : ""}`} />
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
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
