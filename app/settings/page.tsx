"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, Shield, Lock, User, Eye, EyeOff, Trash2, Download, Save } from "lucide-react"
import { useRouter } from "next/navigation"

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  appointmentReminders: boolean
  healthTips: boolean
  marketingEmails: boolean
}

interface PrivacySettings {
  profileVisibility: "public" | "private" | "friends"
  shareHealthData: boolean
  allowDataAnalytics: boolean
  thirdPartySharing: boolean
}

interface SecuritySettings {
  twoFactorAuth: boolean
  loginAlerts: boolean
  sessionTimeout: number
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    healthTips: true,
    marketingEmails: false,
  })

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: "private",
    shareHealthData: false,
    allowDataAnalytics: true,
    thirdPartySharing: false,
  })

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30,
  })

  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/auth/signin")
      return
    }

    // Load settings from localStorage
    const savedNotifications = localStorage.getItem("notificationSettings")
    const savedPrivacy = localStorage.getItem("privacySettings")
    const savedSecurity = localStorage.getItem("securitySettings")

    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }
    if (savedPrivacy) {
      setPrivacy(JSON.parse(savedPrivacy))
    }
    if (savedSecurity) {
      setSecurity(JSON.parse(savedSecurity))
    }
  }, [router])

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    const updated = { ...notifications, [key]: value }
    setNotifications(updated)
    localStorage.setItem("notificationSettings", JSON.stringify(updated))
  }

  const handlePrivacyChange = (key: keyof PrivacySettings, value: any) => {
    const updated = { ...privacy, [key]: value }
    setPrivacy(updated)
    localStorage.setItem("privacySettings", JSON.stringify(updated))
  }

  const handleSecurityChange = (key: keyof SecuritySettings, value: any) => {
    const updated = { ...security, [key]: value }
    setSecurity(updated)
    localStorage.setItem("securitySettings", JSON.stringify(updated))
  }

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage("Please fill in all password fields")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage("New password must be at least 6 characters")
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setMessage("Password changed successfully!")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Failed to change password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = () => {
    // Simulate data export
    const userData = {
      profile: JSON.parse(localStorage.getItem("userProfile") || "{}"),
      appointments: JSON.parse(localStorage.getItem("appointments") || "[]"),
      medicalRecords: JSON.parse(localStorage.getItem("medicalRecords") || "[]"),
      notifications: JSON.parse(localStorage.getItem("notifications") || "[]"),
    }

    const dataStr = JSON.stringify(userData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "my-health-data.json"
    link.click()

    setMessage("Data exported successfully!")
    setTimeout(() => setMessage(""), 3000)
  }

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // Clear all data
      localStorage.clear()
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and privacy settings</p>
        </div>

        {message && (
          <Alert
            className={`mb-6 ${message.includes("success") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            <AlertDescription className={message.includes("success") ? "text-green-800" : "text-red-800"}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via text message</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="appointment-reminders">Appointment Reminders</Label>
                    <p className="text-sm text-gray-600">Get reminded about upcoming appointments</p>
                  </div>
                  <Switch
                    id="appointment-reminders"
                    checked={notifications.appointmentReminders}
                    onCheckedChange={(checked) => handleNotificationChange("appointmentReminders", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="health-tips">Health Tips</Label>
                    <p className="text-sm text-gray-600">Receive personalized health tips and advice</p>
                  </div>
                  <Switch
                    id="health-tips"
                    checked={notifications.healthTips}
                    onCheckedChange={(checked) => handleNotificationChange("healthTips", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-gray-600">Receive promotional emails and updates</p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={notifications.marketingEmails}
                    onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <p className="text-sm text-gray-600 mb-2">Control who can see your profile information</p>
                  <select
                    id="profile-visibility"
                    value={privacy.profileVisibility}
                    onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="friends">Friends Only</option>
                  </select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="share-health-data">Share Health Data</Label>
                    <p className="text-sm text-gray-600">Allow sharing of anonymized health data for research</p>
                  </div>
                  <Switch
                    id="share-health-data"
                    checked={privacy.shareHealthData}
                    onCheckedChange={(checked) => handlePrivacyChange("shareHealthData", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-analytics">Data Analytics</Label>
                    <p className="text-sm text-gray-600">Allow us to analyze your data to improve our services</p>
                  </div>
                  <Switch
                    id="data-analytics"
                    checked={privacy.allowDataAnalytics}
                    onCheckedChange={(checked) => handlePrivacyChange("allowDataAnalytics", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="third-party-sharing">Third-party Sharing</Label>
                    <p className="text-sm text-gray-600">Allow sharing data with trusted third-party partners</p>
                  </div>
                  <Switch
                    id="third-party-sharing"
                    checked={privacy.thirdPartySharing}
                    onCheckedChange={(checked) => handlePrivacyChange("thirdPartySharing", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button onClick={handlePasswordChange} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Changing..." : "Change Password"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="two-factor-auth">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      id="two-factor-auth"
                      checked={security.twoFactorAuth}
                      onCheckedChange={(checked) => handleSecurityChange("twoFactorAuth", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="login-alerts">Login Alerts</Label>
                      <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
                    </div>
                    <Switch
                      id="login-alerts"
                      checked={security.loginAlerts}
                      onCheckedChange={(checked) => handleSecurityChange("loginAlerts", checked)}
                    />
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <p className="text-sm text-gray-600 mb-2">Automatically log out after period of inactivity</p>
                    <select
                      id="session-timeout"
                      value={security.sessionTimeout}
                      onChange={(e) => handleSecurityChange("sessionTimeout", Number.parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                      <option value={0}>Never</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Account Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Export Your Data</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Download a copy of all your health data, appointments, and medical records.
                    </p>
                    <Button
                      onClick={handleExportData}
                      variant="outline"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Download className="w-4 h-4" />
                      Export Data
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2 text-red-600">Danger Zone</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button
                      onClick={handleDeleteAccount}
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-2 bg-transparent"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
