"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Pill, AlertTriangle, ShoppingCart, ExternalLink, Info } from "lucide-react"

interface Medication {
  id: number
  name: string
  genericName: string
  category: string
  type: "prescription" | "otc"
  uses: string[]
  dosage: string
  sideEffects: string[]
  precautions: string[]
  price: number
  availability: "in-stock" | "limited" | "out-of-stock"
  image: string
  description: string
}

const medications: Medication[] = [
  {
    id: 1,
    name: "Imiquimod Cream",
    genericName: "Imiquimod 5%",
    category: "Topical Immunomodulator",
    type: "prescription",
    uses: ["Actinic keratosis", "Superficial basal cell carcinoma", "External genital warts"],
    dosage: "Apply 3 times per week before bedtime",
    sideEffects: ["Skin irritation", "Redness", "Swelling", "Itching"],
    precautions: ["Avoid sun exposure", "Not for use during pregnancy", "Wash hands after application"],
    price: 89.99,
    availability: "in-stock",
    image: "/images/medication-1.jpg",
    description:
      "Topical immune response modifier used to treat certain skin conditions including some types of skin cancer.",
  },
  {
    id: 2,
    name: "Fluorouracil Cream",
    genericName: "5-Fluorouracil 5%",
    category: "Topical Chemotherapy",
    type: "prescription",
    uses: ["Actinic keratosis", "Superficial basal cell carcinoma"],
    dosage: "Apply twice daily for 2-4 weeks",
    sideEffects: ["Burning sensation", "Crusting", "Erosion", "Pain"],
    precautions: ["Avoid pregnancy", "Use sun protection", "May cause photosensitivity"],
    price: 67.5,
    availability: "in-stock",
    image: "/images/medication-2.jpg",
    description: "Topical chemotherapy agent that destroys abnormal skin cells by interfering with DNA synthesis.",
  },
  {
    id: 3,
    name: "Tretinoin Cream",
    genericName: "Tretinoin 0.025%",
    category: "Retinoid",
    type: "prescription",
    uses: ["Acne", "Photoaging", "Actinic keratosis prevention"],
    dosage: "Apply once daily at bedtime",
    sideEffects: ["Dryness", "Peeling", "Redness", "Initial breakouts"],
    precautions: ["Avoid during pregnancy", "Use sunscreen", "Start with lower concentration"],
    price: 45.0,
    availability: "in-stock",
    image: "/images/medication-3.jpg",
    description:
      "Vitamin A derivative that promotes cell turnover and helps prevent formation of precancerous lesions.",
  },
  {
    id: 4,
    name: "Hydrocortisone Cream",
    genericName: "Hydrocortisone 1%",
    category: "Topical Corticosteroid",
    type: "otc",
    uses: ["Eczema", "Dermatitis", "Insect bites", "Minor skin irritation"],
    dosage: "Apply 2-4 times daily as needed",
    sideEffects: ["Skin thinning with prolonged use", "Burning", "Itching"],
    precautions: ["Don't use on face for extended periods", "Avoid broken skin", "Limit use to 7 days"],
    price: 12.99,
    availability: "in-stock",
    image: "/images/medication-4.jpg",
    description: "Mild topical steroid that reduces inflammation and relieves itching from various skin conditions.",
  },
  {
    id: 5,
    name: "Sunscreen SPF 50+",
    genericName: "Zinc Oxide & Titanium Dioxide",
    category: "Sun Protection",
    type: "otc",
    uses: ["UV protection", "Skin cancer prevention", "Photoaging prevention"],
    dosage: "Apply liberally 15 minutes before sun exposure, reapply every 2 hours",
    sideEffects: ["Rare allergic reactions", "White residue"],
    precautions: ["Avoid eye contact", "Test on small area first"],
    price: 24.99,
    availability: "in-stock",
    image: "/images/medication-5.jpg",
    description: "Broad-spectrum mineral sunscreen providing protection against UVA and UVB rays.",
  },
  {
    id: 6,
    name: "Mohs Surgery Kit",
    genericName: "Surgical Instruments",
    category: "Surgical Supplies",
    type: "prescription",
    uses: ["Skin cancer removal", "Mohs micrographic surgery"],
    dosage: "Professional use only",
    sideEffects: ["N/A - Professional use"],
    precautions: ["Sterile technique required", "Professional training needed"],
    price: 299.99,
    availability: "limited",
    image: "/images/medication-6.jpg",
    description: "Specialized surgical instruments for precise skin cancer removal with minimal tissue loss.",
  },
]

export default function MedicationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  const filteredMedications = medications.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.uses.some((use) => use.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || med.category === selectedCategory
    const matchesType = selectedType === "all" || med.type === selectedType
    const matchesTab = activeTab === "all" || med.type === activeTab

    return matchesSearch && matchesCategory && matchesType && matchesTab
  })

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "in-stock":
        return "bg-green-100 text-green-800"
      case "limited":
        return "bg-yellow-100 text-yellow-800"
      case "out-of-stock":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Dermatology Medications</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive information about medications used in dermatology and skin cancer treatment
          </p>
        </div>

        {/* Important Notice */}
        <Alert className="mb-8 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Important:</strong> This information is for educational purposes only. Always consult with a
            healthcare professional before starting any medication. Prescription medications require a valid
            prescription from a licensed physician.
          </AlertDescription>
        </Alert>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="all">All Medications</TabsTrigger>
            <TabsTrigger value="prescription">Prescription</TabsTrigger>
            <TabsTrigger value="otc">Over-the-Counter</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Search Medications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search medications or conditions"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Topical Immunomodulator">Immunomodulator</SelectItem>
                  <SelectItem value="Topical Chemotherapy">Chemotherapy</SelectItem>
                  <SelectItem value="Retinoid">Retinoid</SelectItem>
                  <SelectItem value="Topical Corticosteroid">Corticosteroid</SelectItem>
                  <SelectItem value="Sun Protection">Sun Protection</SelectItem>
                  <SelectItem value="Surgical Supplies">Surgical</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="prescription">Prescription Only</SelectItem>
                  <SelectItem value="otc">Over-the-Counter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Medications Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredMedications.map((medication) => (
            <Card key={medication.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={medication.image || "/placeholder.svg"}
                      alt={medication.name}
                      className="w-20 h-20 rounded-lg object-cover bg-gray-100"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{medication.name}</h3>
                        <p className="text-gray-600 text-sm">{medication.genericName}</p>
                        <p className="text-blue-600 font-medium text-sm">{medication.category}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          variant={medication.type === "prescription" ? "default" : "secondary"}
                          className={
                            medication.type === "prescription"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {medication.type === "prescription" ? "Prescription" : "OTC"}
                        </Badge>
                        <Badge className={getAvailabilityColor(medication.availability)}>
                          {medication.availability.replace("-", " ")}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{medication.description}</p>

                    <div className="space-y-3 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1">Uses:</h4>
                        <div className="flex flex-wrap gap-1">
                          {medication.uses.slice(0, 3).map((use, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {use}
                            </Badge>
                          ))}
                          {medication.uses.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{medication.uses.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1">Dosage:</h4>
                        <p className="text-gray-600 text-sm">{medication.dosage}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-gray-900">${medication.price}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Info className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                        {medication.type === "otc" && medication.availability === "in-stock" && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                        )}
                        {medication.type === "prescription" && (
                          <Button size="sm" variant="outline">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Find Pharmacy
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expandable Details */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Common Side Effects:</h5>
                      <ul className="text-gray-600 space-y-1">
                        {medication.sideEffects.slice(0, 3).map((effect, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            {effect}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Precautions:</h5>
                      <ul className="text-gray-600 space-y-1">
                        {medication.precautions.slice(0, 3).map((precaution, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                            {precaution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMedications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Pill className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No medications found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Educational Resources */}
        <Card className="mt-8 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle>Medication Safety Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Before Taking Any Medication</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Consult with your healthcare provider</li>
                  <li>• Inform about allergies and current medications</li>
                  <li>• Follow prescribed dosage exactly</li>
                  <li>• Read all warnings and precautions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">When to Contact Your Doctor</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Severe or unexpected side effects</li>
                  <li>• No improvement after prescribed duration</li>
                  <li>• Signs of allergic reaction</li>
                  <li>• Questions about dosage or usage</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
