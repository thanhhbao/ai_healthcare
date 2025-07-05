"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Brain, Camera, AlertTriangle, CheckCircle, Info, ArrowRight } from "lucide-react"
import Link from "next/link"

interface DiagnosisResult {
  riskLevel: "low" | "moderate" | "high"
  confidence: number
  findings: string[]
  recommendations: string[]
  nextSteps: string[]
}

export default function DiagnosisPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setResult(null)

      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate AI analysis with progress updates
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        return prev + Math.random() * 15
      })
    }, 200)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock analysis result
    const mockResult: DiagnosisResult = {
      riskLevel: Math.random() > 0.7 ? "moderate" : "low",
      confidence: Math.floor(Math.random() * 20) + 80,
      findings: [
        "Irregular pigmentation detected",
        "Asymmetrical border characteristics",
        "Size within normal parameters",
        "Color variation noted in central region",
      ],
      recommendations: [
        "Schedule consultation with dermatologist within 2-4 weeks",
        "Monitor for changes in size, color, or texture",
        "Avoid excessive sun exposure",
        "Use broad-spectrum sunscreen daily",
      ],
      nextSteps: [
        "Book appointment with certified dermatologist",
        "Take additional photos for comparison",
        "Document any symptoms or changes",
        "Consider professional biopsy if recommended",
      ],
    }

    clearInterval(progressInterval)
    setAnalysisProgress(100)
    setResult(mockResult)
    setIsAnalyzing(false)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      case "moderate":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "low":
        return <CheckCircle className="w-5 h-5" />
      case "moderate":
        return <Info className="w-5 h-5" />
      case "high":
        return <AlertTriangle className="w-5 h-5" />
      default:
        return <Info className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">AI Skin Cancer Diagnosis</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload a clear image of your skin concern for instant AI-powered analysis
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-600" />
              Upload Your Image
            </CardTitle>
            <CardDescription>
              For best results, ensure good lighting and the area fills most of the frame
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="space-y-4">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="max-w-xs max-h-64 mx-auto rounded-lg shadow-md"
                    />
                    <p className="text-sm text-gray-600">
                      {selectedFile?.name} ({Math.round((selectedFile?.size || 0) / 1024)} KB)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-blue-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">JPEG, PNG files up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>

              {selectedFile && !isAnalyzing && !result && (
                <Button onClick={handleAnalyze} size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                  <Brain className="w-5 h-5 mr-2" />
                  Analyze with AI
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Progress */}
        {isAnalyzing && (
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">AI Analysis in Progress</h3>
                <p className="text-gray-600">Our advanced algorithms are analyzing your image...</p>
                <div className="max-w-md mx-auto">
                  <Progress value={analysisProgress} className="h-3" />
                  <p className="text-sm text-gray-500 mt-2">{Math.round(analysisProgress)}% Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Risk Assessment */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Risk Assessment</h4>
                    <div className={`p-4 rounded-lg border ${getRiskColor(result.riskLevel)}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {getRiskIcon(result.riskLevel)}
                        <span className="font-semibold capitalize">{result.riskLevel} Risk</span>
                      </div>
                      <p className="text-sm">Confidence: {result.confidence}%</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Findings</h4>
                    <ul className="space-y-2">
                      {result.findings.map((finding, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Immediate Actions</h4>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Next Steps</h4>
                    <ul className="space-y-2">
                      {result.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Notice */}
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Important:</strong> This AI analysis is for screening purposes only and should not replace
                professional medical advice. Please consult with a qualified dermatologist for definitive diagnosis and
                treatment recommendations.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/doctors">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-6">
                  Book Doctor Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setSelectedFile(null)
                  setResult(null)
                  setPreviewUrl(null)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                  }
                }}
                className="px-8 py-6"
              >
                Analyze Another Image
              </Button>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <Card className="mt-8 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle>Tips for Better Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Photo Guidelines</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Use natural lighting when possible</li>
                  <li>• Keep the camera steady and in focus</li>
                  <li>• Fill the frame with the area of concern</li>
                  <li>• Avoid shadows or reflections</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">What to Look For</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Changes in size, shape, or color</li>
                  <li>• Irregular or asymmetrical borders</li>
                  <li>• Multiple colors within one spot</li>
                  <li>• Diameter larger than 6mm</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
