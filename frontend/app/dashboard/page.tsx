"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, TrendingUp, Utensils, Activity, Apple, Calculator, Upload, Send, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function DashboardPage() {
    
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const initialMessage = "Hello! I'm your diabetes health assistant. I can help you track meals, analyze nutrition, and manage your blood sugar levels. How can I assist you today?"

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < initialMessage.length) {
        setMessages(prev => prev.map((msg, i) => 
          i === 0 ? { ...msg, content: initialMessage.slice(0, index + 1) } : msg
        ))
        index++
      } else {
        setIsTyping(false)
        clearInterval(timer)
      }
    }, 50)
    return () => clearInterval(timer)
  }, [])

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { role: "user", content: input }])
    setInput("")
    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I understand you're asking about that. Let me help you with personalized health insights based on your diabetes management needs.",
        },
      ])
    }, 1000)
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 via-white to-blue-50 flex flex-col">
      {/* Top Section - Centered Heading */}
      <div className="shrink-0 py-12 px-4 text-center border-b border-border">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl text-foreground mb-3 text-balance font-serif">
            Manage Your Diabetes Health Journey
          </h1>
          <p className="text-muted-foreground text-base md:text-lg text-pretty">
            Track your nutrition, scan meals with AI, and get personalized insights for better diabetes management.
          </p>
        </div>
      </div>

      {/* Middle Section - Feature Buttons + Chat Interface */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Feature Action Buttons */}
        <div className="shrink-0 py-6 px-4 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <Button
                onClick={handleImageUpload}
                variant="outline"
                className="flex items-center gap-3 h-auto py-3 px-5 min-w-fit rounded-full border-2 hover:bg-accent hover:border-primary transition-all whitespace-nowrap bg-transparent"
              >
                <Camera className="w-5 h-5 text-primary" />
                <span className="font-medium">Scan Food</span>
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setMessages((prev) => [
                      ...prev,
                      { role: "user", content: `Uploaded image: ${file.name}` },
                      {
                        role: "assistant",
                        content:
                          "Analyzing your food image... I can see this appears to be a healthy meal. Let me provide nutritional details.",
                      },
                    ])
                  }
                }}
              />

              <Link href="/meals">
                <Button
                  variant="outline"
                  className="flex items-center gap-3 h-auto py-3 px-5 min-w-fit rounded-full border-2 hover:bg-accent hover:border-primary transition-all whitespace-nowrap bg-transparent"
                >
                  <Utensils className="w-5 h-5 text-primary" />
                  <span className="font-medium">Meal Planner</span>
                </Button>
              </Link>

              <Link href="/analytics">
                <Button
                  variant="outline"
                  className="flex items-center gap-3 h-auto py-3 px-5 min-w-fit rounded-full border-2 hover:bg-accent hover:border-primary transition-all whitespace-nowrap bg-transparent"
                >
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="font-medium">Analytics</span>
                </Button>
              </Link>

              <Button
                variant="outline"
                className="flex items-center gap-3 h-auto py-3 px-5 min-w-fit rounded-full border-2 hover:bg-accent hover:border-primary transition-all whitespace-nowrap bg-transparent"
              >
                <Activity className="w-5 h-5 text-primary" />
                <span className="font-medium">Blood Sugar</span>
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-3 h-auto py-3 px-5 min-w-fit rounded-full border-2 hover:bg-accent hover:border-primary transition-all whitespace-nowrap bg-transparent"
              >
                <Calculator className="w-5 h-5 text-primary" />
                <span className="font-medium">Calculator</span>
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-3 h-auto py-3 px-5 min-w-fit rounded-full border-2 hover:bg-accent hover:border-primary transition-all whitespace-nowrap bg-transparent"
              >
                <Apple className="w-5 h-5 text-primary" />
                <span className="font-medium">Food Database</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Messages Area */}
<div className="flex-1 overflow-y-auto px-4 py-6 bg-white">
  <div className="max-w-3xl mx-auto space-y-4">

    {messages.map((message, index) => (
      <div
        key={index}
        className={`flex ${
          message.role === "user" ? "justify-end" : "justify-start"
        } animate-in fade-in-50 duration-500 slide-in-from-bottom-2`}
      >
        <Card
          className={`
            max-w-[85%] md:max-w-[75%]
            rounded-xl border
            bg-white
            ${message.role === "user"
              ? "border-gray-400"
              : "border-gray-300"
            }
          `}
        >
          <CardContent className="p-3">
            <p className="text-sm leading-relaxed text-gray-900">
              {message.content}
              {message.role === "assistant" && index === 0 && isTyping && (
                <span className="animate-pulse">|</span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    ))}

  </div>
</div>


        {/* Fixed Bottom Input */}
        <div className="shrink-0 border-t border-border bg-background/80 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleImageUpload}
                variant="outline"
                size="icon"
                className="rounded-full shrink-0 border-2 bg-transparent"
              >
                <Upload className="w-5 h-5 text-muted-foreground" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about nutrition, meals, or diabetes management..."
                className="flex-1 rounded-full border-2 px-4 py-6 text-base focus-visible:ring-primary"
              />
              <Button
                onClick={handleSend}
                size="icon"
                className="rounded-full shrink-0 bg-primary hover:bg-primary/90"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Disclaimer */}
      <div className="shrink-0 border-t border-border bg-muted/30 px-4 py-6 text-center">
        <p className="text-xs text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          By using this app, you agree that we may use your health data to provide personalized recommendations and
          improve our services in accordance with our Privacy Policy. We maintain strict confidentiality and security
          standards for all health information.
        </p>
      </div>
    </div>
  )
}