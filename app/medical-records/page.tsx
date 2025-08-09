"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Search, Filter, Calendar, User, Pill, Activity, Eye, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface MedicalRecord {
  id: string
  title: string
  type: "diagnosis" | "prescription" | "test" | "report"
  date: string
  doctor: string
  status: "active" | "completed" | "pending"
  description: string
  fileUrl?: string
  tags: string[]
}

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([])
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

    // Load medical records from localStorage
    const savedRecords = localStorage.getItem("medicalRecords")
    if (savedRecords) {
      const parsedRecords = JSON.parse(savedRecords)
      setRecords(parsedRecords)
      setFilteredRecords(parsedRecords)
    } else {
      // Sample data
      const sampleRecords: MedicalRecord[] = [
        {
          id: "1",
          title: "Skin Condition Diagnosis",
          type: "diagnosis",
          date: "2024-01-10",
          doctor: "Dr. Sarah Johnson",
          status: "active",
          description: "Diagnosed with mild eczema. Prescribed topical treatment.",
          tags: ["dermatology", "eczema", "skin"],
        },
        {
          id: "2",
          title: "Blood Test Results",
          type: "test",
          date: "2024-01-08",
          doctor: "Dr. Michael Chen",
          status: "completed",
          description: "Complete blood count and lipid panel results.",
          fileUrl: "/sample-blood-test.pdf",
          tags: ["blood test", "lab results"],
        },
        {
          id: "3",
          title: "Hydrocortisone Cream",
          type: "prescription",
          date: "2024-01-10",
          doctor: "Dr. Sarah Johnson",
          status: "active",
          description: "Apply twice daily to affected areas for 2 weeks.",
          tags: ["prescription", "topical", "eczema"],
        },
        {
          id: "4",
          title: "Annual Health Report",
          type: "report",
          date: "2024-01-05",
          doctor: "Dr. Michael Chen",
          status: "completed",
          description: "Comprehensive annual health assessment report.",
          fileUrl: "/sample-health-report.pdf",
          tags: ["annual", "health", "checkup"],
        },
      ]
      setRecords(sampleRecords)
      setFilteredRecords(sampleRecords)
      localStorage.setItem("medicalRecords", JSON.stringify(sampleRecords))
    }
  }, [router])

  useEffect(() => {
    let filtered = records

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((record) => record.type === activeTab)
    }

    setFilteredRecords(filtered)
  }, [records, searchTerm, activeTab])

  const handleDownload = (record: MedicalRecord) => {
    if (record.fileUrl) {
      // Simulate file download
      alert(`Downloading ${record.title}`)
    } else {
      alert("No file available for download")
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "diagnosis":
        return "bg-red-100 text-red-800"
      case "prescription":
        return "bg-blue-100 text-blue-800"
      case "test":
        return "bg-green-100 text-green-800"
      case "report":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "diagnosis":
        return <Activity className="w-4 h-4" />
      case "prescription":
        return <Pill className="w-4 h-4" />
      case "test":
        return <FileText className="w-4 h-4" />
      case "report":
        return <FileText className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const stats = {
    total: records.length,
    diagnosis: records.filter((r) => r.type === "diagnosis").length,
    prescription: records.filter((r) => r.type === "prescription").length,
    test: records.filter((r) => r.type === "test").length,
    report: records.filter((r) => r.type === "report").length,
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
            <p className="text-gray-600 mt-2">Access and manage your medical history</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Record
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Diagnosis</p>
                  <p className="text-2xl font-bold text-red-600">{stats.diagnosis}</p>
                </div>
                <Activity className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Prescriptions</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.prescription}</p>
                </div>
                <Pill className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tests</p>
                  <p className="text-2xl font-bold text-green-600">{stats.test}</p>
                </div>
                <FileText className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reports</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.report}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
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
                  placeholder="Search medical records..."
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

        {/* Records Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
            <TabsTrigger value="prescription">Prescriptions</TabsTrigger>
            <TabsTrigger value="test">Tests</TabsTrigger>
            <TabsTrigger value="report">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {filteredRecords.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
                    <p className="text-gray-600">
                      {searchTerm ? "Try adjusting your search terms" : "You don't have any medical records yet"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredRecords.map((record) => (
                  <Card key={record.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 bg-gray-100 rounded-lg">{getTypeIcon(record.type)}</div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{record.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getTypeColor(record.type)}>{record.type}</Badge>
                                <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-3">{record.description}</p>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {record.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {record.doctor}
                            </div>
                          </div>

                          {record.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {record.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline" className="flex items-center gap-2 bg-transparent">
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                          {record.fileUrl && (
                            <Button
                              size="sm"
                              onClick={() => handleDownload(record)}
                              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </Button>
                          )}
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
