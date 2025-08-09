"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Search, Filter, Check, Calendar, Heart, AlertTriangle, Info, Trash2, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface Notification {
  id: string
  title: string
  message: string
  type: "appointment" | "health" | "system" | "reminder"
  priority: "low" | "medium" | "high"
  isRead: boolean
  createdAt: string
  actionUrl?: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
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

    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem("notifications")
    if (savedNotifications) {
      const parsedNotifications = JSON.parse(savedNotifications)
      setNotifications(parsedNotifications)
      setFilteredNotifications(parsedNotifications)
    } else {
      // Sample data
      const sampleNotifications: Notification[] = [
        {
          id: "1",
          title: "Upcoming Appointment",
          message: "You have an appointment with Dr. Sarah Johnson tomorrow at 10:00 AM",
          type: "appointment",
          priority: "high",
          isRead: false,
          createdAt: "2024-01-14T09:00:00Z",
          actionUrl: "/appointments",
        },
        {
          id: "2",
          title: "Health Tip",
          message: "Remember to drink at least 8 glasses of water daily for optimal health",
          type: "health",
          priority: "low",
          isRead: true,
          createdAt: "2024-01-13T08:00:00Z",
        },
        {
          id: "3",
          title: "System Update",
          message: "We've updated our privacy policy. Please review the changes.",
          type: "system",
          priority: "medium",
          isRead: false,
          createdAt: "2024-01-12T14:30:00Z",
          actionUrl: "/privacy",
        },
        {
          id: "4",
          title: "Medication Reminder",
          message: "Time to take your prescribed medication - Hydrocortisone Cream",
          type: "reminder",
          priority: "high",
          isRead: false,
          createdAt: "2024-01-14T07:00:00Z",
        },
        {
          id: "5",
          title: "Test Results Available",
          message: "Your blood test results are now available in your medical records",
          type: "health",
          priority: "medium",
          isRead: true,
          createdAt: "2024-01-11T16:45:00Z",
          actionUrl: "/medical-records",
        },
      ]
      setNotifications(sampleNotifications)
      setFilteredNotifications(sampleNotifications)
      localStorage.setItem("notifications", JSON.stringify(sampleNotifications))
    }
  }, [router])

  useEffect(() => {
    let filtered = notifications

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (notification) =>
          notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.message.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by tab
    if (activeTab !== "all") {
      if (activeTab === "unread") {
        filtered = filtered.filter((notification) => !notification.isRead)
      } else {
        filtered = filtered.filter((notification) => notification.type === activeTab)
      }
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredNotifications(filtered)
  }, [notifications, searchTerm, activeTab])

  const handleMarkAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === notificationId ? { ...notification, isRead: true } : notification,
    )
    setNotifications(updatedNotifications)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
  }

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      isRead: true,
    }))
    setNotifications(updatedNotifications)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
  }

  const handleDeleteNotification = (notificationId: string) => {
    const updatedNotifications = notifications.filter((notification) => notification.id !== notificationId)
    setNotifications(updatedNotifications)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      handleMarkAsRead(notification.id)
    }

    // Navigate to action URL if available
    if (notification.actionUrl) {
      router.push(notification.actionUrl)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="w-4 h-4" />
      case "health":
        return <Heart className="w-4 h-4" />
      case "system":
        return <Info className="w-4 h-4" />
      case "reminder":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  const stats = {
    total: notifications.length,
    unread: notifications.filter((n) => !n.isRead).length,
    appointment: notifications.filter((n) => n.type === "appointment").length,
    health: notifications.filter((n) => n.type === "health").length,
    system: notifications.filter((n) => n.type === "system").length,
    reminder: notifications.filter((n) => n.type === "reminder").length,
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-2">Stay updated with your health and appointments</p>
          </div>
          {stats.unread > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline">
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Bell className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-red-600">{stats.unread}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Appointments</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.appointment}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search notifications..."
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

        {/* Notifications Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="appointment">Appointments</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="reminder">Reminders</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                    <p className="text-gray-600">
                      {searchTerm ? "Try adjusting your search terms" : "You're all caught up!"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                      !notification.isRead ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`p-2 rounded-lg ${
                              notification.type === "appointment"
                                ? "bg-blue-100 text-blue-600"
                                : notification.type === "health"
                                  ? "bg-green-100 text-green-600"
                                  : notification.type === "system"
                                    ? "bg-gray-100 text-gray-600"
                                    : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {getTypeIcon(notification.type)}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-medium ${!notification.isRead ? "font-semibold" : ""}`}>
                                {notification.title}
                              </h3>
                              {!notification.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                            </div>

                            <p className="text-gray-600 text-sm mb-2">{notification.message}</p>

                            <div className="flex items-center gap-2">
                              <Badge className={getPriorityColor(notification.priority)}>{notification.priority}</Badge>
                              <Badge variant="outline">{notification.type}</Badge>
                              <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMarkAsRead(notification.id)
                              }}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteNotification(notification.id)
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
