"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Star,
  MapPin,
  Video,
  MessageCircle,
  Phone,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Simple Calendar Component (reused from doctor detail page)
function SimpleCalendar({
  selected,
  onSelect,
}: {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
}) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const days = getDaysInMonth(currentDate)

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return selected && date.toDateString() === selected.toDateString()
  }

  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="sm" onClick={goToPreviousMonth} className="h-7 w-7 p-0 bg-transparent">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <h3 className="text-sm font-medium">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>

        <Button variant="outline" size="sm" onClick={goToNextMonth} className="h-7 w-7 p-0 bg-transparent">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div key={index} className="h-8 flex items-center justify-center">
            {day ? (
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 text-sm ${
                  isSelected(day)
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : isToday(day)
                      ? "bg-blue-100 text-blue-600"
                      : isPastDate(day)
                        ? "text-gray-400 cursor-not-allowed"
                        : "hover:bg-gray-100"
                }`}
                onClick={() => !isPastDate(day) && onSelect?.(day)}
                disabled={isPastDate(day)}
              >
                {day.getDate()}
              </Button>
            ) : (
              <div className="h-8 w-8" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const doctorData = {
  1: {
    name: "Dr. Sarah Johnson",
    specialty: "Dermatologist",
    rating: 4.9,
    reviews: 324,
    experience: 12,
    location: "New York, NY",
    consultationFee: 150,
    languages: ["English", "Spanish"],
    image: "/images/doctor-1.jpg",
    bio: "Dr. Sarah Johnson is a board-certified dermatologist with over 12 years of experience specializing in skin cancer detection and treatment.",
  },
}

export default function BookingPage({ params }: { params: { doctorId: string } }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState("")
  const [consultationType, setConsultationType] = useState("video")
  const [symptoms, setSymptoms] = useState("")
  const [patientName, setPatientName] = useState("")
  const [patientEmail, setPatientEmail] = useState("")
  const [patientPhone, setPatientPhone] = useState("")
  const [isBooking, setIsBooking] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  const doctor = doctorData[1] // In real app, use params.doctorId

  useEffect(() => {
    // Check authentication
    const authStatus = localStorage.getItem("isAuthenticated")
    const userData = localStorage.getItem("user")

    if (authStatus === "true" && userData) {
      setIsAuthenticated(true)
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setPatientName(parsedUser.name || "")
      setPatientEmail(parsedUser.email || "")
    } else {
      // Redirect to sign in if not authenticated
      router.push("/auth/signin")
    }
  }, [router])

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !patientName || !patientEmail) {
      alert("Please fill in all required fields")
      return
    }

    setIsBooking(true)

    try {
      // Simulate booking process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create appointment data
      const appointment = {
        id: Date.now().toString(),
        doctorId: params.doctorId,
        doctorName: doctor.name,
        doctorImage: doctor.image,
        patientName,
        patientEmail,
        patientPhone,
        date: selectedDate.toISOString(),
        time: selectedTime,
        consultationType,
        symptoms,
        status: "confirmed",
        fee: doctor.consultationFee,
        createdAt: new Date().toISOString(),
      }

      // Store appointment
      const existingAppointments = JSON.parse(localStorage.getItem("appointments") || "[]")
      existingAppointments.push(appointment)
      localStorage.setItem("appointments", JSON.stringify(existingAppointments))

      // Redirect to consultation page
      router.push(`/consultation/${consultationType}?appointmentId=${appointment.id}`)
    } catch (error) {
      alert("Booking failed. Please try again.")
    } finally {
      setIsBooking(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link href="/doctors" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Doctors
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Consultation</h1>
          <p className="text-gray-600">Schedule your appointment with {doctor.name}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Doctor Info */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <img
                    src={doctor.image || "/placeholder.svg"}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>
                          {doctor.rating} ({doctor.reviews} reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{doctor.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Appointment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Consultation Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Type *</label>
                  <Select value={consultationType} onValueChange={setConsultationType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          Video Call - ${doctor.consultationFee}
                        </div>
                      </SelectItem>
                      <SelectItem value="chat">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          Text Chat - ${doctor.consultationFee - 20}
                        </div>
                      </SelectItem>
                      <SelectItem value="phone">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone Call - ${doctor.consultationFee - 30}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date *</label>
                  <div className="border rounded-lg overflow-hidden bg-white">
                    <SimpleCalendar selected={selectedDate} onSelect={setSelectedDate} />
                  </div>
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Times *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["09:00", "10:30", "11:00", "14:00", "15:30", "16:00"].map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        disabled={time === "14:00"} // Example of unavailable slot
                        className={time === "14:00" ? "opacity-50 cursor-not-allowed" : ""}
                      >
                        {time}
                        {time === "14:00" && <span className="ml-1 text-xs">(Booked)</span>}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Patient Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Patient Information</h4>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <Input
                        placeholder="Your full name"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <Input
                        type="email"
                        placeholder="Your email address"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <Input
                      type="tel"
                      placeholder="Your phone number"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms & Concerns</label>
                    <Textarea
                      placeholder="Please describe your symptoms, concerns, or reason for consultation..."
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor:</span>
                    <span className="font-medium">{doctor.name}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <Badge variant="outline" className="capitalize">
                      {consultationType === "video" && <Video className="w-3 h-3 mr-1" />}
                      {consultationType === "chat" && <MessageCircle className="w-3 h-3 mr-1" />}
                      {consultationType === "phone" && <Phone className="w-3 h-3 mr-1" />}
                      {consultationType}
                    </Badge>
                  </div>

                  {selectedDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{selectedDate.toLocaleDateString()}</span>
                    </div>
                  )}

                  {selectedTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                  )}

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span className="text-blue-600">
                        $
                        {consultationType === "video"
                          ? doctor.consultationFee
                          : consultationType === "chat"
                            ? doctor.consultationFee - 20
                            : doctor.consultationFee - 30}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                  onClick={handleBooking}
                  disabled={!selectedTime || !patientName || !patientEmail || isBooking}
                >
                  {isBooking ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirm Booking
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  You will receive a confirmation email with meeting details
                </p>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <h4 className="font-medium text-gray-900 mb-3">Important Notes</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Please join the consultation 5 minutes early</li>
                  <li>• Have your medical history and current medications ready</li>
                  <li>• Ensure stable internet connection for video calls</li>
                  <li>• Cancellation allowed up to 24 hours before appointment</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
