"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, User, FileText, Brain, Star, MapPin, Clock, Eye } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface SearchResult {
  type: "doctor" | "medication" | "article" | "service"
  title: string
  description: string
  href: string
  image?: string
  rating?: number
  reviews?: number
  location?: string
  price?: number
  readTime?: number
  views?: number
  author?: string
}

const allSearchData: SearchResult[] = [
  // Doctors
  {
    type: "doctor",
    title: "Dr. Sarah Johnson",
    description:
      "Board-certified dermatologist specializing in skin cancer detection and treatment with over 12 years of experience.",
    href: "/doctors/1",
    image: "/images/doctor-1.jpg",
    rating: 4.9,
    reviews: 324,
    location: "New York, NY",
    price: 150,
  },
  {
    type: "doctor",
    title: "Dr. Michael Chen",
    description: "Expert in melanoma diagnosis and advanced dermatological procedures with 15 years experience.",
    href: "/doctors/2",
    image: "/images/doctor-2.jpg",
    rating: 4.8,
    reviews: 256,
    location: "Los Angeles, CA",
    price: 175,
  },
  {
    type: "doctor",
    title: "Dr. Emily Rodriguez",
    description: "Focused on preventive dermatology and early skin cancer detection.",
    href: "/doctors/3",
    image: "/images/doctor-3.jpg",
    rating: 4.9,
    reviews: 412,
    location: "Chicago, IL",
    price: 140,
  },

  // Medications
  {
    type: "medication",
    title: "Imiquimod Cream",
    description:
      "Topical immune response modifier used to treat certain skin conditions including some types of skin cancer.",
    href: "/medications",
    image: "/images/medication-1.jpg",
    price: 89.99,
  },
  {
    type: "medication",
    title: "Tretinoin Cream",
    description:
      "Vitamin A derivative that promotes cell turnover and helps prevent formation of precancerous lesions.",
    href: "/medications",
    image: "/images/medication-3.jpg",
    price: 45.0,
  },
  {
    type: "medication",
    title: "Sunscreen SPF 50+",
    description: "Broad-spectrum mineral sunscreen providing protection against UVA and UVB rays.",
    href: "/medications",
    image: "/images/medication-5.jpg",
    price: 24.99,
  },

  // Knowledge articles
  {
    type: "article",
    title: "Understanding Melanoma: Early Detection and Prevention",
    description:
      "Learn about the most dangerous form of skin cancer, how to identify warning signs, and effective prevention strategies.",
    href: "/knowledge/1",
    image: "/images/article-1.jpg",
    readTime: 8,
    views: 15420,
    author: "Dr. Sarah Johnson",
  },
  {
    type: "article",
    title: "The ABCDE Rule: Your Guide to Spotting Skin Cancer",
    description:
      "A comprehensive guide explaining the ABCDE rule for identifying potentially cancerous moles and skin lesions.",
    href: "/knowledge/2",
    image: "/images/article-2.jpg",
    readTime: 5,
    views: 23150,
    author: "Dr. Michael Chen",
  },
  {
    type: "article",
    title: "Basal Cell Carcinoma: The Most Common Skin Cancer",
    description:
      "Everything you need to know about basal cell carcinoma, including symptoms, treatment options, and prognosis.",
    href: "/knowledge/3",
    image: "/images/article-3.jpg",
    readTime: 6,
    views: 12890,
    author: "Dr. Emily Rodriguez",
  },

  // Services
  {
    type: "service",
    title: "AI Skin Cancer Diagnosis",
    description:
      "Upload a clear image of your skin concern for instant AI-powered analysis and professional recommendations.",
    href: "/diagnosis",
    image: "/images/ai-analysis.jpg",
  },
  {
    type: "service",
    title: "Video Consultation with Dermatologists",
    description: "Book online video consultations with certified dermatologists from the comfort of your home.",
    href: "/doctors",
    image: "/images/doctor-1.jpg",
  },
  {
    type: "service",
    title: "Comprehensive Skin Cancer Screening",
    description:
      "Professional full-body skin examination by experienced dermatologists using advanced diagnostic tools.",
    href: "/doctors",
    image: "/images/hero-medical.jpg",
  },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeTab, setActiveTab] = useState("all")
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([])

  useEffect(() => {
    handleSearch(searchQuery, activeTab)
  }, [searchQuery, activeTab])

  const handleSearch = (query: string, tab: string) => {
    let results = allSearchData

    // Filter by search query
    if (query.trim()) {
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          (item.author && item.author.toLowerCase().includes(query.toLowerCase())) ||
          (item.location && item.location.toLowerCase().includes(query.toLowerCase())),
      )
    }

    // Filter by tab
    if (tab !== "all") {
      results = results.filter((item) => item.type === tab)
    }

    setFilteredResults(results)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "doctor":
        return <User className="w-5 h-5 text-blue-600" />
      case "medication":
        return (
          <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        )
      case "article":
        return <FileText className="w-5 h-5 text-purple-600" />
      case "service":
        return <Brain className="w-5 h-5 text-cyan-600" />
      default:
        return <Search className="w-5 h-5 text-gray-400" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "doctor":
        return "bg-blue-100 text-blue-800"
      case "medication":
        return "bg-green-100 text-green-800"
      case "article":
        return "bg-purple-100 text-purple-800"
      case "service":
        return "bg-cyan-100 text-cyan-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Search Results</h1>
          {searchQuery && (
            <p className="text-xl text-gray-600">
              Showing results for "<span className="font-semibold">{searchQuery}</span>"
            </p>
          )}
        </div>

        {/* Search Bar */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search doctors, medications, articles, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 text-lg h-12"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl mx-auto">
            <TabsTrigger value="all">All ({allSearchData.length})</TabsTrigger>
            <TabsTrigger value="doctor">
              Doctors ({allSearchData.filter((r) => r.type === "doctor").length})
            </TabsTrigger>
            <TabsTrigger value="medication">
              Medications ({allSearchData.filter((r) => r.type === "medication").length})
            </TabsTrigger>
            <TabsTrigger value="article">
              Articles ({allSearchData.filter((r) => r.type === "article").length})
            </TabsTrigger>
            <TabsTrigger value="service">
              Services ({allSearchData.filter((r) => r.type === "service").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Results */}
        <div className="space-y-4">
          {filteredResults.map((result, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {result.image && (
                    <div className="flex-shrink-0">
                      <img
                        src={result.image || "/placeholder.svg"}
                        alt={result.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(result.type)}
                        <Badge className={getTypeColor(result.type)}>{result.type}</Badge>
                      </div>
                    </div>

                    <Link href={result.href} className="group">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                        {result.title}
                      </h3>
                    </Link>

                    <p className="text-gray-600 mb-4">{result.description}</p>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      {result.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>
                            {result.rating} ({result.reviews} reviews)
                          </span>
                        </div>
                      )}

                      {result.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{result.location}</span>
                        </div>
                      )}

                      {result.readTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{result.readTime} min read</span>
                        </div>
                      )}

                      {result.views && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{result.views.toLocaleString()} views</span>
                        </div>
                      )}

                      {result.author && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>By {result.author}</span>
                        </div>
                      )}
                    </div>

                    {result.price && (
                      <div className="mt-3">
                        <span className="text-2xl font-bold text-gray-900">${result.price}</span>
                        {result.type === "doctor" && <span className="text-gray-500 ml-1">consultation</span>}
                      </div>
                    )}

                    <div className="mt-4">
                      <Link href={result.href}>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          {result.type === "doctor" && "Book Consultation"}
                          {result.type === "medication" && "View Details"}
                          {result.type === "article" && "Read Article"}
                          {result.type === "service" && "Try Service"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResults.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              {searchQuery
                ? `No results found for "${searchQuery}". Try different keywords or browse our categories.`
                : "Start typing to search for doctors, medications, articles, and services."}
            </p>
          </div>
        )}

        {/* Suggestions */}
        {searchQuery && filteredResults.length === 0 && (
          <Card className="mt-8 border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Popular Searches</h3>
              <div className="flex flex-wrap gap-2">
                {["skin cancer", "melanoma", "dermatologist", "sunscreen", "mole check", "ABCDE rule"].map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery(term)}
                    className="bg-transparent"
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
