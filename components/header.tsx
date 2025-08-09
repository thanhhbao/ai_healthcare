"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Brain, Menu, Phone, User, LogOut, Settings, Calendar, Bell, FileText, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "AI Diagnosis", href: "/diagnosis" },
    { name: "Doctors", href: "/doctors" },
    { name: "Medications", href: "/medications" },
    { name: "Knowledge", href: "/knowledge" },
  ]

  const checkAuthStatus = () => {
    const authStatus = localStorage.getItem("isAuthenticated")
    const userData = localStorage.getItem("user")

    if (authStatus === "true" && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
    } else {
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  useEffect(() => {
    // Check authentication status on mount
    checkAuthStatus()

    // Listen for storage changes (when user logs in/out)
    const handleStorageChange = () => {
      checkAuthStatus()
    }

    window.addEventListener("storage", handleStorageChange)

    // Also listen for custom events
    window.addEventListener("authChange", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("authChange", handleStorageChange)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
    localStorage.removeItem("appointments")
    localStorage.removeItem("medicalRecords")
    localStorage.removeItem("notifications")
    setIsAuthenticated(false)
    setUser(null)

    // Trigger auth change event
    window.dispatchEvent(new Event("authChange"))

    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SkinAI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Phone className="w-4 h-4 mr-2" />
              Emergency
            </Button>

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors border-none bg-transparent outline-none focus:outline-none">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="hidden lg:block font-medium text-gray-900">
                    {user.name || user.email?.split("@")[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">{user.name || "User"}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>

                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profile")}>
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/appointments")}>
                    <Calendar className="w-4 h-4 mr-3" />
                    My Appointments
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/medical-records")}>
                    <FileText className="w-4 h-4 mr-3" />
                    Medical Records
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/notifications")}>
                    <Bell className="w-4 h-4 mr-3" />
                    Notifications
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/settings")}>
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/signin">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                {/* Mobile Navigation */}
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="pt-4 border-t space-y-2">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Phone className="w-4 h-4 mr-2" />
                    Emergency
                  </Button>

                  {isAuthenticated && user ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.name || "User"}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>

                      <Link href="/profile" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full bg-transparent justify-start">
                          <User className="w-4 h-4 mr-2" />
                          Profile
                        </Button>
                      </Link>

                      <Link href="/appointments" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full bg-transparent justify-start">
                          <Calendar className="w-4 h-4 mr-2" />
                          My Appointments
                        </Button>
                      </Link>

                      <Link href="/medical-records" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full bg-transparent justify-start">
                          <FileText className="w-4 h-4 mr-2" />
                          Medical Records
                        </Button>
                      </Link>

                      <Link href="/settings" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full bg-transparent justify-start">
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Button>
                      </Link>

                      <Button
                        variant="outline"
                        className="w-full bg-transparent text-red-600 border-red-200 hover:bg-red-50 justify-start"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <User className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
