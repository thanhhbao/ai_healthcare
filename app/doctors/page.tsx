"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MapPin, Clock, Video, MessageCircle, Filter, Search } from "lucide-react"
import Link from "next/link"

interface Doctor {
  id: number
  name: string
  specialty: string
  rating: number
  reviews: number
  experience: number
  location: string
  availability: string
  consultationFee: number
  languages: string[]
  image: string
  bio: string
  nextAvailable: string
}

const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Dermatologist",
    rating: 4.9,
    reviews: 324,
    experience: 12,
    location: "New York, NY",
    availability: "Available Today",
    consultationFee: 150,
    languages: ["English", "Spanish"],
    image: "/images/doctor-1.jpg",
    bio: "Specialized in skin cancer detection and treatment with over 12 years of experience.",
    nextAvailable: "Today 2:00 PM",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Dermatologist",
    rating: 4.8,
    reviews: 256,
    experience: 15,
    location: "Los Angeles, CA",
    availability: "Available Tomorrow",
    consultationFee: 175,
    languages: ["English", "Mandarin"],
    image: "/images/doctor-2.jpg",
    bio: "Expert in melanoma diagnosis and advanced dermatological procedures.",
    nextAvailable: "Tomorrow 10:00 AM",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Dermatologist",
    rating: 4.9,
    reviews: 412,
    experience: 10,
    location: "Chicago, IL",
    availability: "Available Today",
    consultationFee: 140,
    languages: ["English", "Spanish", "Portuguese"],
    image: "/images/doctor-3.jpg",
    bio: "Focused on preventive dermatology and early skin cancer detection.",
    nextAvailable: "Today 4:30 PM",
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Dermatologist",
    rating: 4.7,
    reviews: 189,
    experience: 8,
    location: "Houston, TX",
    availability: "Available This Week",
    consultationFee: 130,
    languages: ["English"],
    image: "/images/doctor-4.jpg",
    bio: "Specializes in dermatopathology and skin cancer screening.",
    nextAvailable: "Wednesday 1:00 PM",
  },
  {
    id: 5,
    name: "Dr. Lisa Thompson",
    specialty: "Dermatologist",
    rating: 4.8,
    reviews: 298,
    experience: 14,
    location: "Miami, FL",
    availability: "Available Tomorrow",
    consultationFee: 160,
    languages: ["English", "French"],
    image: "/images/doctor-5.jpg",
    bio: "Expert in cosmetic and medical dermatology with focus on skin cancer prevention.",
    nextAvailable: "Tomorrow 3:15 PM",
  },
  {
    id: 6,
    name: "Dr. Robert Kim",
    specialty: "Dermatologist",
    rating: 4.9,
    reviews: 367,
    experience: 16,
    location: "Seattle, WA",
    availability: "Available Today",
    consultationFee: 180,
    languages: ["English", "Korean"],
    image: "/images/doctor-6.jpg",
    bio: "Leading expert in Mohs surgery and advanced skin cancer treatments.",
    nextAvailable: "Today 5:00 PM",
  },
]

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [selectedAvailability, setSelectedAvailability] = useState("all")
  const [sortBy, setSortBy] = useState("rating")

  const filteredDoctors = doctors
    .filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSpecialty = selectedSpecialty === "all" || doctor.specialty === selectedSpecialty
      const matchesAvailability =
        selectedAvailability === "all" || doctor.availability.toLowerCase().includes(selectedAvailability.toLowerCase())

      return matchesSearch && matchesSpecialty && matchesAvailability
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "experience":
          return b.experience - a.experience
        case "price":
          return a.consultationFee - b.consultationFee
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Consult with Expert Dermatologists</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Book online consultations with certified dermatologists specializing in skin cancer diagnosis and treatment
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              Find Your Doctor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or location"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="Dermatologist">Dermatologist</SelectItem>
                  <SelectItem value="Oncologist">Oncologist</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                <SelectTrigger>
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Time</SelectItem>
                  <SelectItem value="today">Available Today</SelectItem>
                  <SelectItem value="tomorrow">Available Tomorrow</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                  <SelectItem value="price">Lowest Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Doctors Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={doctor.image || "/placeholder.svg"}
                      alt={doctor.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                        <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`${
                          doctor.availability.includes("Today")
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {doctor.availability}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{doctor.rating}</span>
                        <span>({doctor.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{doctor.location}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{doctor.bio}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-gray-600">
                        <div>{doctor.experience} years experience</div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-4 h-4" />
                          Next: {doctor.nextAvailable}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">${doctor.consultationFee}</div>
                        <div className="text-sm text-gray-500">consultation</div>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-4">
                      {doctor.languages.map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/booking/${doctor.id}?type=video`} className="flex-1">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          <Video className="w-4 h-4 mr-2" />
                          Book Video Call
                        </Button>
                      </Link>
                      <Link href={`/booking/${doctor.id}?type=chat`} className="flex-1">
                        <Button variant="outline" className="w-full bg-transparent">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Book Chat
                        </Button>
                      </Link>
                    </div>

                    <div className="mt-2">
                      <Link href={`/doctors/${doctor.id}`}>
                        <Button variant="outline" className="w-full bg-transparent">
                          View Full Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Emergency Notice */}
        <Card className="mt-8 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div>
                <h4 className="font-semibold text-red-900 mb-2">Emergency Situations</h4>
                <p className="text-red-800 text-sm">
                  If you notice rapid changes in a mole or skin lesion, bleeding, or severe symptoms, please seek
                  immediate medical attention at your nearest emergency room or call 911.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
