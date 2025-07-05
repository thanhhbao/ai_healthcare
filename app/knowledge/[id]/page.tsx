"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Clock,
  Eye,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Calendar,
  User,
  Tag,
  FileText,
  Video,
  BookOpen,
} from "lucide-react"
import Link from "next/link"

const articleData = {
  1: {
    title: "Understanding Melanoma: Early Detection and Prevention",
    category: "Skin Cancer",
    type: "article" as const,
    readTime: 8,
    views: 15420,
    author: "Dr. Sarah Johnson",
    publishDate: "2024-01-15",
    image: "/images/article-1.jpg",
    tags: ["melanoma", "prevention", "early detection", "ABCDE rule"],
    content: `
      <h2>What is Melanoma?</h2>
      <p>Melanoma is the most serious type of skin cancer, developing in the cells (melanocytes) that produce melanin — the pigment that gives your skin its color. Melanoma can also form in your eyes and, rarely, inside your body, such as in your nose or throat.</p>
      
      <p>The exact cause of all melanomas isn't clear, but exposure to ultraviolet (UV) radiation from sunlight or tanning lamps and beds increases your risk of developing melanoma. Limiting your exposure to UV radiation can help reduce your risk of melanoma.</p>

      <h2>Early Warning Signs: The ABCDE Rule</h2>
      <p>The ABCDE rule is a helpful guide for the common signs of melanoma. Be on the lookout for:</p>
      
      <ul>
        <li><strong>A - Asymmetry:</strong> One half of the mole doesn't match the other half</li>
        <li><strong>B - Border:</strong> The edges are irregular, ragged, notched, or blurred</li>
        <li><strong>C - Color:</strong> The color is not the same all over and may include shades of brown or black, or sometimes with patches of pink, red, white, or blue</li>
        <li><strong>D - Diameter:</strong> The spot is larger than 6 millimeters across (about ¼ inch – the size of a pencil eraser)</li>
        <li><strong>E - Evolving:</strong> The mole is changing in size, shape, or color</li>
      </ul>

      <h2>Risk Factors</h2>
      <p>Several factors can increase your risk of melanoma:</p>
      
      <ul>
        <li>Fair skin, freckles, light hair, and light eyes</li>
        <li>History of sunburns</li>
        <li>Excessive UV light exposure</li>
        <li>Living closer to the equator or at higher elevations</li>
        <li>Having many moles or unusual moles</li>
        <li>Family history of melanoma</li>
        <li>Weakened immune system</li>
        <li>Age (risk increases with age)</li>
      </ul>

      <h2>Prevention Strategies</h2>
      <p>You can reduce your risk of melanoma and other types of skin cancer by:</p>
      
      <ul>
        <li><strong>Avoiding the sun during peak hours:</strong> Avoid sun exposure between 10 a.m. and 4 p.m.</li>
        <li><strong>Wearing sunscreen year-round:</strong> Use broad-spectrum sunscreen with an SPF of at least 30</li>
        <li><strong>Wearing protective clothing:</strong> Cover your skin with dark, tightly woven clothing</li>
        <li><strong>Avoiding tanning lamps and beds:</strong> These emit UV rays and can increase your risk</li>
        <li><strong>Becoming familiar with your skin:</strong> Examine your skin regularly for new growths or changes</li>
      </ul>

      <h2>When to See a Doctor</h2>
      <p>Make an appointment with your doctor if you notice:</p>
      
      <ul>
        <li>A new spot on your skin or a spot that's changing in size, shape, or color</li>
        <li>A spot that looks different from other spots on your body</li>
        <li>A spot that's itchy, tender, or bleeding</li>
      </ul>

      <h2>Treatment Options</h2>
      <p>Treatment for melanoma depends on the stage of the cancer and your overall health. Options may include:</p>
      
      <ul>
        <li><strong>Surgery:</strong> The primary treatment for early-stage melanoma</li>
        <li><strong>Immunotherapy:</strong> Helps your immune system fight cancer</li>
        <li><strong>Targeted therapy:</strong> Uses drugs that attack specific cancer cell features</li>
        <li><strong>Chemotherapy:</strong> Uses drugs to kill cancer cells</li>
        <li><strong>Radiation therapy:</strong> Uses high-energy beams to kill cancer cells</li>
      </ul>

      <h2>Living with Melanoma</h2>
      <p>If you've been diagnosed with melanoma, it's important to:</p>
      
      <ul>
        <li>Follow your treatment plan carefully</li>
        <li>Attend all follow-up appointments</li>
        <li>Protect your skin from further sun damage</li>
        <li>Perform regular skin self-examinations</li>
        <li>Seek support from family, friends, or support groups</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Early detection is key to successful melanoma treatment. By understanding the warning signs, knowing your risk factors, and taking preventive measures, you can protect yourself and catch any potential problems early. Remember, when in doubt, consult with a dermatologist or healthcare professional.</p>
    `,
  },
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const article = articleData[1] // In real app, use params.id to fetch specific article

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
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link href="/knowledge" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Knowledge Library
        </Link>

        {/* Article Header */}
        <Card className="border-0 shadow-lg mb-8">
          <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
            <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-full object-cover" />
          </div>

          <CardContent className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge className={getTypeColor(article.type)}>
                {getTypeIcon(article.type)}
                <span className="ml-1 capitalize">{article.type}</span>
              </Badge>
              <Badge variant="outline">{article.category}</Badge>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">{article.title}</h1>

            <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>By {article.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.publishDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{article.readTime} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{article.views.toLocaleString()} views</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              {article.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ThumbsUp className="w-4 h-4 mr-2" />
                Like (234)
              </Button>
              <Button variant="outline">
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Comment (12)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Article Content */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-8">
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </CardContent>
        </Card>

        {/* Author Bio */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">About the Author</h3>
            <div className="flex gap-4">
              <img src="/images/doctor-1.jpg" alt={article.author} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h4 className="font-semibold text-gray-900">{article.author}</h4>
                <p className="text-blue-600 text-sm mb-2">Board-Certified Dermatologist</p>
                <p className="text-gray-600 text-sm">
                  Dr. Sarah Johnson is a board-certified dermatologist with over 12 years of experience specializing in
                  skin cancer detection and treatment. She has published numerous research papers on melanoma diagnosis
                  and is passionate about patient education.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/knowledge/2" className="group">
                <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <img src="/images/article-2.jpg" alt="ABCDE Rule" className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      The ABCDE Rule: Your Guide to Spotting Skin Cancer
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">5 min read</p>
                  </div>
                </div>
              </Link>

              <Link href="/knowledge/3" className="group">
                <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <img
                    src="/images/article-3.jpg"
                    alt="Basal Cell Carcinoma"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      Basal Cell Carcinoma: The Most Common Skin Cancer
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">6 min read</p>
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
