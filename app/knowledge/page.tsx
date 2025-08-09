"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, BookOpen, Video, FileText, Clock, Eye, Heart, Shield, User } from "lucide-react"
import Link from "next/link"

interface Article {
  id: number
  title: string
  category: string
  type: "article" | "video" | "infographic"
  readTime: number
  views: number
  author: string
  publishDate: string
  excerpt: string
  image: string
  tags: string[]
}

const articles: Article[] = [
  {
    id: 1,
    title: "Understanding Melanoma: Early Detection and Prevention",
    category: "Skin Cancer",
    type: "article",
    readTime: 8,
    views: 15420,
    author: "Dr. Sarah Johnson",
    publishDate: "2024-01-15",
    excerpt:
      "Learn about the most dangerous form of skin cancer, how to identify warning signs, and effective prevention strategies using the ABCDE rule.",
    image: "/images/article-1.jpg",
    tags: ["melanoma", "prevention", "early detection", "ABCDE rule", "skin cancer", "warning signs"],
  },
  {
    id: 2,
    title: "The ABCDE Rule: Your Guide to Spotting Skin Cancer",
    category: "Prevention",
    type: "video",
    readTime: 5,
    views: 23150,
    author: "Dr. Michael Chen",
    publishDate: "2024-01-10",
    excerpt:
      "A comprehensive video guide explaining the ABCDE rule for identifying potentially cancerous moles and skin lesions.",
    image: "/images/article-2.jpg",
    tags: [
      "ABCDE rule",
      "mole check",
      "skin examination",
      "self-screening",
      "asymmetry",
      "border",
      "color",
      "diameter",
    ],
  },
  {
    id: 3,
    title: "Basal Cell Carcinoma: The Most Common Skin Cancer",
    category: "Skin Cancer",
    type: "article",
    readTime: 6,
    views: 12890,
    author: "Dr. Emily Rodriguez",
    publishDate: "2024-01-08",
    excerpt:
      "Everything you need to know about basal cell carcinoma, including symptoms, treatment options, and prognosis.",
    image: "/images/article-3.jpg",
    tags: ["basal cell carcinoma", "treatment", "symptoms", "prognosis", "skin cancer", "BCC"],
  },
  {
    id: 4,
    title: "Sun Protection: Your First Line of Defense",
    category: "Prevention",
    type: "infographic",
    readTime: 3,
    views: 18750,
    author: "Dr. James Wilson",
    publishDate: "2024-01-05",
    excerpt:
      "Visual guide to effective sun protection strategies, including sunscreen selection and proper application techniques.",
    image: "/images/article-4.jpg",
    tags: ["sun protection", "sunscreen", "UV rays", "prevention", "SPF", "skin care"],
  },
  {
    id: 5,
    title: "Squamous Cell Carcinoma: Recognition and Treatment",
    category: "Skin Cancer",
    type: "article",
    readTime: 7,
    views: 9630,
    author: "Dr. Lisa Thompson",
    publishDate: "2024-01-03",
    excerpt: "Detailed information about squamous cell carcinoma, the second most common form of skin cancer.",
    image: "/images/article-5.jpg",
    tags: ["squamous cell carcinoma", "recognition", "treatment", "risk factors", "SCC", "skin cancer"],
  },
  {
    id: 6,
    title: "Mohs Surgery: Precision Treatment for Skin Cancer",
    category: "Treatment",
    type: "video",
    readTime: 10,
    views: 7420,
    author: "Dr. Robert Kim",
    publishDate: "2024-01-01",
    excerpt:
      "Learn about Mohs micrographic surgery, a precise technique for removing skin cancer with minimal tissue loss.",
    image: "/images/article-6.jpg",
    tags: ["Mohs surgery", "treatment", "precision", "skin cancer removal", "micrographic surgery"],
  },
  {
    id: 7,
    title: "Skin Cancer Risk Factors: What You Need to Know",
    category: "Prevention",
    type: "article",
    readTime: 5,
    views: 14280,
    author: "Dr. Sarah Johnson",
    publishDate: "2023-12-28",
    excerpt:
      "Comprehensive overview of factors that increase your risk of developing skin cancer and how to minimize them.",
    image: "/images/article-7.jpg",
    tags: ["risk factors", "prevention", "genetics", "lifestyle", "UV exposure", "family history"],
  },
  {
    id: 8,
    title: "Post-Treatment Care: Recovery and Follow-up",
    category: "Treatment",
    type: "article",
    readTime: 6,
    views: 5890,
    author: "Dr. Michael Chen",
    publishDate: "2023-12-25",
    excerpt:
      "Essential information about caring for yourself after skin cancer treatment and the importance of regular follow-ups.",
    image: "/images/article-8.jpg",
    tags: ["post-treatment", "recovery", "follow-up", "care", "healing", "monitoring"],
  },
]

export default function KnowledgePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesTab = activeTab === "all" || article.category.toLowerCase() === activeTab

    return matchesSearch && matchesTab
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="w-4 h-4" />
      case "video":
        return <Video className="w-4 h-4" />
      case "infographic":
        return <BookOpen className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "article":
        return "bg-blue-100 text-blue-800"
      case "video":
        return "bg-red-100 text-red-800"
      case "infographic":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Healthcare Knowledge Library</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive resources about skin cancer, prevention, treatment, and skincare from medical experts
          </p>
        </div>

        {/* Featured Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-600">Articles</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-pink-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-600">Videos</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-600">Infographics</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-600">Total Views</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search articles, videos, and guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="all">All Resources</TabsTrigger>
            <TabsTrigger value="skin cancer">Skin Cancer</TabsTrigger>
            <TabsTrigger value="prevention">Prevention</TabsTrigger>
            <TabsTrigger value="treatment">Treatment</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Card
              key={article.id}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="aspect-video bg-gray-100">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getTypeColor(article.type)}>
                    {getTypeIcon(article.type)}
                    <span className="ml-1 capitalize">{article.type}</span>
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {article.category}
                  </Badge>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime} min read</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{article.views.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {article.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {article.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{article.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>By {article.author}</span>
                    </div>
                    <div>{new Date(article.publishDate).toLocaleDateString()}</div>
                  </div>
                  <Link href={`/knowledge/${article.id}`}>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Read More
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? `No results found for "${searchTerm}". Try different keywords or browse categories.`
                : "Try adjusting your search terms or browse different categories"}
            </p>

            {searchTerm && (
              <div className="mt-4">
                <Button variant="outline" onClick={() => setSearchTerm("")} className="bg-transparent">
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Educational Highlights */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Prevention First</h3>
              <p className="text-gray-600 text-sm">
                Learn evidence-based strategies to prevent skin cancer and protect your skin health.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Early Detection</h3>
              <p className="text-gray-600 text-sm">
                Master the skills needed to identify potential skin cancer signs and symptoms early.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Care</h3>
              <p className="text-gray-600 text-sm">
                Access treatment information and recovery guidance from leading dermatologists.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
