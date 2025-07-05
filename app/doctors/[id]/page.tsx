"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Star,
  MapPin,
  Clock,
  Video,
  MessageCircle,
  Phone,
  Award,
  GraduationCap,
  Users,
  CheckCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

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
    bio: "Dr. Sarah Johnson is a board-certified dermatologist with over 12 years of experience specializing in skin cancer detection and treatment. She completed her residency at Mount Sinai Hospital and has published numerous research papers on melanoma diagnosis.",
    education: [
      "MD - Harvard Medical School",
      "Residency - Mount Sinai Hospital",
      "Fellowship - Memorial Sloan Kettering",
    ],
    certifications: ["Board Certified Dermatologist", "American Academy of Dermatology", "Mohs Surgery Certified"],
    specialties: ["Skin Cancer Detection", "Melanoma Treatment", "Mohs Surgery", "Dermatopathology"],
    availableSlots: [
      { date: "2024-01-20", time: "09:00", available: true },
      { date: "2024-01-20", time: "10:30", available: true },
      { date: "2024-01-20", time: "14:00", available: false },
      { date: "2024-01-20", time: "15:30", available: true },
      { date: "2024-01-21", time: "09:00", available: true },
      { date: "2024-01-21", time: "11:00", available: true },
    ],
  },
}

// Simple Calendar Component
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

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
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
      {/* Header */}
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

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
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

export default function DoctorDetailPage({ params }: { params: { id: string } }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState("")
  const [consultationType, setConsultationType] = useState("video")
  const [symptoms, setSymptoms] = useState("")
  const [patientName, setPatientName] = useState("")
  const [patientEmail, setPatientEmail] = useState("")
  const [isBooking, setIsBooking] = useState(false)

  const doctor = doctorData[1] // In real app, use params.id

  const handleBooking = async () => {
    setIsBooking(true)
    // Simulate booking process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsBooking(false)
    alert("Appointment booked successfully! You will receive a confirmation email shortly.")
  }

  const reviews = [
    {
      id: 1,
      name: "Jennifer Smith",
      rating: 5,
      date: "2024-01-15",
      comment:
        "Dr. Johnson was incredibly thorough and professional. She took the time to explain everything and made me feel comfortable throughout the consultation.",
    },
    {
      id: 2,
      name: "Michael Brown",
      rating: 5,
      date: "2024-01-10",
      comment:
        "Excellent doctor! Her expertise in skin cancer detection is outstanding. The AI diagnosis tool she recommended was very helpful.",
    },
    {
      id: 3,
      name: "Lisa Davis",
      rating: 4,
      date: "2024-01-08",
      comment:
        "Very knowledgeable and caring. The video consultation was smooth and she provided detailed follow-up instructions.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Link href="/doctors" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Doctors
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Doctor Profile */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <img
                    src={doctor.image || "/placeholder.svg"}
                    alt={doctor.name}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
                    <p className="text-xl text-blue-600 font-medium mb-3">{doctor.specialty}</p>

                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="font-medium">{doctor.rating}</span>
                        <span className="text-gray-600">({doctor.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">{doctor.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">{doctor.experience} years exp.</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-4">
                      {doctor.languages.map((lang) => (
                        <Badge key={lang} variant="outline">
                          {lang}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-gray-600">{doctor.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="specialties">Specialties</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">About Dr. {doctor.name.split(" ")[1]}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {doctor.bio} She is passionate about early detection and prevention of skin cancer, utilizing the
                      latest AI technology and traditional diagnostic methods to provide comprehensive care to her
                      patients.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specialties" className="mt-6">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Areas of Expertise</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {doctor.specialties.map((specialty, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-gray-700">{specialty}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Patient Reviews</h3>
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                {review.name.charAt(0)}
                              </div>
                              <span className="font-medium">{review.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm">{review.comment}</p>
                          <p className="text-gray-400 text-xs mt-2">{review.date}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education" className="mt-6">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <GraduationCap className="w-5 h-5 text-blue-600" />
                          Education
                        </h3>
                        <div className="space-y-2">
                          {doctor.education.map((edu, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              <span className="text-gray-700">{edu}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <Award className="w-5 h-5 text-blue-600" />
                          Certifications
                        </h3>
                        <div className="space-y-2">
                          {doctor.certifications.map((cert, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                              <span className="text-gray-700">{cert}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Book Consultation</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">${doctor.consultationFee}</div>
                    <div className="text-sm text-gray-500">per session</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Consultation Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Type</label>
                  <Select value={consultationType} onValueChange={setConsultationType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          Video Call
                        </div>
                      </SelectItem>
                      <SelectItem value="chat">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          Text Chat
                        </div>
                      </SelectItem>
                      <SelectItem value="phone">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone Call
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <div className="border rounded-lg overflow-hidden bg-white">
                    <SimpleCalendar selected={selectedDate} onSelect={setSelectedDate} />
                  </div>
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Times</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["09:00", "10:30", "14:00", "15:30"].map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        disabled={time === "14:00"} // Example of unavailable slot
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Patient Information */}
                <div className="space-y-3">
                  <Input
                    placeholder="Your full name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                  />
                  <Textarea
                    placeholder="Describe your symptoms or concerns..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                  onClick={handleBooking}
                  disabled={!selectedTime || !patientName || !patientEmail || isBooking}
                >
                  {isBooking
                    ? "Booking..."
                    : `Book ${consultationType === "video" ? "Video" : consultationType === "chat" ? "Chat" : "Phone"} Consultation`}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  You will receive a confirmation email with meeting details
                </p>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Patients Treated</span>
                    </div>
                    <span className="font-semibold">2,500+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm">Average Rating</span>
                    </div>
                    <span className="font-semibold">{doctor.rating}/5.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Response Time</span>
                    </div>
                    <span className="font-semibold">&lt; 2 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
