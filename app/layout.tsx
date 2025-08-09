import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Chatbot from "@/components/chatbot"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SkinAI - Advanced AI Skin Cancer Diagnosis",
  description:
    "Get instant, accurate skin cancer screening using cutting-edge artificial intelligence. Upload a photo and receive professional-grade analysis in seconds.",
  keywords: "skin cancer, AI diagnosis, dermatology, melanoma, skin health, online consultation",
    generator: 'thanhbao'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  )
}
