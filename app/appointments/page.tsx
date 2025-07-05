"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  User,
  Video,
  MessageCircle,
  Phone,
  Search,
  Filter,
  X,
  CheckCircle,
  AlertCircle,
  CalendarIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Appointment {
  id: string
  doctorName: string
  doctorSpecialty: string
  doctorImage: string
  date: string
  time: string
  type: "video" | "chat" | "in-person"
  status: "upcoming" | "completed" | "cancelled"
  reason: string
  notes?: string
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/auth/signin")
      return
    }

    // Load appointments from localStorage
    const savedAppointments = localStorage.getItem("appointments")
    if (savedAppointments) {
      const parsedAppointments = JSON.parse(savedAppointments)
      setAppointments(parsedAppointments)
      setFilteredAppointments(parsedAppointments)
    } else {
      // Sample data
      const sampleAppointments: Appointment[] = [
        {
          id: "1",
          doctorName: "Dr. Sarah Johnson",
          doctorSpecialty: "Dermatologist",
          doctorImage: "/images/doctor-1.jpg",
          date: "2024-01-15",
          time: "10:00 AM",
          type: "video",
          status: "upcoming",
          reason: "Skin consultation",
          notes: "Follow-up on previous treatment",
        },
        {
          id: "2",
          doctorName: "Dr. Michael Chen",
          doctorSpecialty: "General Practitioner",
          doctorImage: "/images/doctor-2.jpg",
          date: "2024-01-12",
          time: "2:30 PM",
          type: "chat",
          status: "completed",
          reason: "General checkup",
        },
        {
          id: "3",
          doctorName: "Dr. Emily Davis",
          doctorSpecialty: "Cardiologist",
          doctorImage: "/images/doctor-3.jpg",
          date: "2024-01-20",
          time: "11:15 AM",
          type: "in-person",
          status: "upcoming",
          reason: "Heart consultation",
        },
      ]
      setAppointments(sampleAppointments)
      setFilteredAppointments(sampleAppointments)
      localStorage.setItem("appointments", JSON.stringify(sampleAppointments))
    }
  }, [router])

  useEffect(() => {
    let filtered = appointments

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.doctorSpecialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.reason.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((appointment) => appointment.status === activeTab)
    }

    setFilteredAppointments(filtered)
  }, [appointments, searchTerm, activeTab])

  const handleCancelAppointment = (appointmentId: string) => {
    const updatedAppointments = appointments.map((appointment) =>
      appointment.id === appointmentId ? { ...appointment, status: "cancelled" as const } : appointment,
    )
    setAppointments(updatedAppointments)
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments))
  }

  const handleJoinCall = (appointment: Appointment) => {
    // Simulate joining a call
    alert(`Joining ${appointment.type} call with ${appointment.doctorName}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />
      case "chat":
        return <MessageCircle className="w-4 h-4" />
      case "in-person":
        return <User className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const stats = {
    total: appointments.length,
    upcoming: appointments.filter((a) => a.status === "upcoming").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-2">Manage your healthcare appointments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <CalendarIcon className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cancelled</p>
                  <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                    <p className="text-gray-600">
                      {searchTerm ? "Try adjusting your search terms" : "You don't have any appointments yet"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={appointment.doctorImage || "/placeholder.svg"}
                            alt={appointment.doctorName}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
                            <p className="text-gray-600">{appointment.doctorSpecialty}</p>
                            <p className="text-sm text-gray-500 mt-1">{appointment.reason}</p>
                            {appointment.notes && (
                              <p className="text-sm text-gray-500 mt-1">Note: {appointment.notes}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col md:items-end gap-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              {getTypeIcon(appointment.type)}
                              {appointment.type}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {appointment.date}
                            <Clock className="w-4 h-4 ml-2" />
                            {appointment.time}
                          </div>

                          <div className="flex gap-2 mt-2">
                            {appointment.status === "upcoming" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleJoinCall(appointment)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  {appointment.type === "video" && <Video className="w-4 h-4 mr-1" />}
                                  {appointment.type === "chat" && <MessageCircle className="w-4 h-4 mr-1" />}
                                  {appointment.type === "in-person" && <Phone className="w-4 h-4 mr-1" />}
                                  Join
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Cancel
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
