"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  MessageCircle,
  Send,
  Users,
  Clock,
  FileText,
  Camera,
  Share,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Message {
  id: number
  sender: "doctor" | "patient"
  message: string
  timestamp: Date
  type: "text" | "image" | "file"
}

export default function ConsultationPage({ params }: { params: { type: string } }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "doctor",
      message: "Hello! I'm Dr. Sarah Johnson. Thank you for booking this consultation. How can I help you today?",
      timestamp: new Date(),
      type: "text",
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [consultationTime, setConsultationTime] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  const consultationType = params.type // 'video', 'chat', or 'phone'

  useEffect(() => {
    // Check authentication
    const authStatus = localStorage.getItem("isAuthenticated")
    const appointmentId = new URLSearchParams(window.location.search).get("appointmentId")

    if (authStatus !== "true") {
      router.push("/auth/signin")
      return
    }

    if (!appointmentId) {
      router.push("/doctors")
      return
    }

    // Verify appointment exists
    const appointments = JSON.parse(localStorage.getItem("appointments") || "[]")
    const appointment = appointments.find((apt: any) => apt.id === appointmentId)

    if (!appointment) {
      router.push("/doctors")
      return
    }

    // Auto-connect if appointment is valid
    setIsConnected(true)
  }, [router])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isConnected) {
      interval = setInterval(() => {
        setConsultationTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isConnected])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: messages.length + 1,
      sender: "patient",
      message: newMessage,
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate doctor response
    setTimeout(() => {
      const responses = [
        "I understand your concern. Can you tell me more about when this started?",
        "That's helpful information. Have you noticed any changes in size or color?",
        "Based on what you're describing, I'd recommend a closer examination. Can you share a photo?",
        "Thank you for sharing that. Let me review this and provide my assessment.",
        "I can see the area you're concerned about. Here's what I recommend...",
      ]

      const doctorResponse: Message = {
        id: messages.length + 2,
        sender: "doctor",
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: "text",
      }

      setMessages((prev) => [...prev, doctorResponse])
    }, 1500)
  }

  const handleConnect = () => {
    setIsConnected(true)
    if (consultationType === "video" && videoRef.current) {
      // In a real app, this would initialize the video stream
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch((err) => console.log("Error accessing media devices:", err))
    }
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setConsultationTime(0)
  }

  const getConsultationTitle = () => {
    switch (consultationType) {
      case "video":
        return "Video Consultation"
      case "chat":
        return "Chat Consultation"
      case "phone":
        return "Phone Consultation"
      default:
        return "Consultation"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/doctors" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{getConsultationTitle()}</h1>
            <Badge variant={isConnected ? "default" : "secondary"} className={isConnected ? "bg-green-600" : ""}>
              {isConnected ? "Connected" : "Waiting"}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              {formatTime(consultationTime)}
            </div>
            <div className="text-sm text-gray-600">Dr. Sarah Johnson</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Video/Phone Area */}
            {(consultationType === "video" || consultationType === "phone") && (
              <Card className="border-0 shadow-lg h-96">
                <CardContent className="p-0 h-full relative">
                  {consultationType === "video" ? (
                    <div className="relative h-full bg-gray-900 rounded-lg overflow-hidden">
                      {isConnected ? (
                        <>
                          {/* Doctor's video (simulated) */}
                          <div className="absolute inset-0">
                            <img
                              src="/images/doctor-1.jpg"
                              alt="Dr. Sarah Johnson"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                              Dr. Sarah Johnson
                            </div>
                          </div>

                          {/* Patient's video (small overlay) */}
                          <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden">
                            <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                            <div className="absolute bottom-1 left-1 text-white text-xs">You</div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center text-white">
                            <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg mb-4">Video call will start here</p>
                            <Button onClick={handleConnect} className="bg-green-600 hover:bg-green-700">
                              <Video className="w-4 h-4 mr-2" />
                              Start Video Call
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-cyan-100">
                      <div className="text-center">
                        <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Phone className="w-16 h-16 text-white" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900 mb-2">Phone Consultation</p>
                        <p className="text-gray-600 mb-4">Dr. Sarah Johnson</p>
                        {!isConnected ? (
                          <Button onClick={handleConnect} className="bg-green-600 hover:bg-green-700">
                            <Phone className="w-4 h-4 mr-2" />
                            Start Call
                          </Button>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-green-600 font-medium">Call in progress</p>
                            <Button onClick={handleDisconnect} variant="destructive">
                              <PhoneOff className="w-4 h-4 mr-2" />
                              End Call
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Controls */}
                  {isConnected && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 rounded-full px-4 py-2">
                      <Button
                        size="sm"
                        variant={isMuted ? "destructive" : "secondary"}
                        onClick={() => setIsMuted(!isMuted)}
                        className="rounded-full w-10 h-10 p-0"
                      >
                        {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>

                      {consultationType === "video" && (
                        <Button
                          size="sm"
                          variant={!isVideoOn ? "destructive" : "secondary"}
                          onClick={() => setIsVideoOn(!isVideoOn)}
                          className="rounded-full w-10 h-10 p-0"
                        >
                          {!isVideoOn ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleDisconnect}
                        className="rounded-full w-10 h-10 p-0"
                      >
                        {consultationType === "video" ? (
                          <VideoOff className="w-4 h-4" />
                        ) : (
                          <PhoneOff className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Chat Area */}
            <Card className="border-0 shadow-lg flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  Chat Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-64 px-6">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender === "patient" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === "patient" ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Doctor Info */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src="/images/doctor-1.jpg"
                    alt="Dr. Sarah Johnson"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">Dr. Sarah Johnson</h3>
                    <p className="text-sm text-gray-600">Dermatologist</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>12 years experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Camera className="w-4 h-4 mr-2" />
                  Share Photo
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <FileText className="w-4 h-4 mr-2" />
                  Share Document
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Share className="w-4 h-4 mr-2" />
                  Screen Share
                </Button>
              </CardContent>
            </Card>

            {/* Session Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Session Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{formatTime(consultationTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{consultationType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={isConnected ? "default" : "secondary"} className={isConnected ? "bg-green-600" : ""}>
                    {isConnected ? "Active" : "Waiting"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
