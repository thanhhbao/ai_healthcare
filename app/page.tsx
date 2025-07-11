import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Brain, Shield, Users, Clock, Star, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <Brain className="w-4 h-4 mr-2" />
                  AI-Powered Healthcare
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Advanced AI Skin Cancer
                  <span className="block text-cyan-300">Diagnosis</span>
                </h1>
                <p className="text-xl text-blue-100 max-w-lg">
                  Get instant, accurate skin cancer screening using cutting-edge artificial intelligence. Upload a photo
                  and receive professional-grade analysis in seconds.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/diagnosis">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    Check Your Skin Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/doctors">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl bg-transparent"
                  >
                    Consult a Doctor
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">99.2%</div>
                  <div className="text-sm text-blue-200">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-sm text-blue-200">Diagnoses Made</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm text-blue-200">Available</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 overflow-hidden">
                <img
                  src="/images/hero-medical.jpg"
                  alt="Medical AI Technology"
                  className="w-full h-64 object-cover rounded-xl opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent rounded-xl"></div>
                <div className="absolute bottom-6 left-6 right-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white/90">HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white/90">FDA Approved Algorithm</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white/90">Instant Results</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Our AI Diagnosis?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our advanced AI technology combines dermatology expertise with machine learning to provide accurate, fast,
              and accessible skin cancer screening.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">AI-Powered Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Advanced machine learning algorithms trained on millions of dermatological images
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Instant Results</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">Get comprehensive analysis and recommendations in under 30 seconds</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-violet-50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Secure & Private</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">HIPAA compliant with end-to-end encryption for your medical data</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-red-50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Expert Backed</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Developed with leading dermatologists and validated by medical professionals
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, fast, and accurate skin cancer screening in three easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Image</h3>
              <p className="text-gray-600">
                Take a clear photo of the skin area you're concerned about and upload it securely
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced AI analyzes your image using deep learning algorithms trained on medical data
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Results</h3>
              <p className="text-gray-600">
                Receive detailed analysis with risk assessment and professional recommendations
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/diagnosis">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Your Analysis Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-gray-600">
              See what our users and medical professionals say about our AI diagnosis tool
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The AI diagnosis gave me peace of mind and helped me catch a potential issue early. The interface is
                  so easy to use, even for someone like me who's not tech-savvy."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    S
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-900">Sarah Johnson</div>
                    <div className="text-sm text-gray-500">Patient</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "As a dermatologist, I'm impressed by the accuracy of this AI tool. It's a valuable screening resource
                  that helps patients make informed decisions."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                    D
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-900">Dr. Michael Chen</div>
                    <div className="text-sm text-gray-500">Dermatologist</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Quick, reliable, and accessible. This platform made it easy for me to get a professional opinion
                  without leaving my home. Highly recommended!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    R
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-900">Robert Martinez</div>
                    <div className="text-sm text-gray-500">Patient</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Check Your Skin Health?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Don't wait when it comes to your health. Get instant AI-powered skin cancer screening now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/diagnosis">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Brain className="w-5 h-5 mr-2" />
                Start Free Diagnosis
              </Button>
            </Link>
            <Link href="/doctors">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl bg-transparent"
              >
                Book Doctor Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
