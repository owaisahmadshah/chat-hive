import React, { useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toPng } from "html-to-image"
import {
  Download,
  MessageSquare,
  Shield,
  Mail,
  User,
  Key,
  AlertTriangle,
} from "lucide-react"

interface SnapshotCardProps {
  email: string
  username: string
  password: string
}

/**
 * SnapshotCard Component
 *
 * A modern, responsive card component for displaying and downloading user credentials.
 * Features:
 * - Dark/light mode support via Tailwind CSS variables
 * - Download credentials as PNG image
 * - Secure credential display with visual hierarchy
 * - Fully responsive design
 * - Smooth animations and transitions
 */
const SnapshotCard: React.FC<SnapshotCardProps> = ({
  email,
  username,
  password,
}) => {
  const cardRef = useRef<HTMLDivElement>(null)

  /**
   * Handles downloading the credential card as a PNG image
   * Uses html-to-image library to convert the card DOM element to image
   */
  const handleDownload = async () => {
    if (!cardRef.current) return

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2, // Higher quality image
      })
      const link = document.createElement("a")
      link.download = `${username}-credentials.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error("Failed to generate image:", err)
    }
  }

  /**
   * Reloads the page to continue to chat interface
   */
  const handleContinueToChat = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-2xl space-y-6 animate-in fade-in duration-500">
        {/* Security Warning Alert */}
        <Alert className="border-destructive/50 bg-destructive/10">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertDescription className="text-sm font-medium ml-2">
            <span className="font-bold text-destructive">Security Notice:</span>{" "}
            This information contains sensitive credentials. Download and store
            securely for future access.
          </AlertDescription>
        </Alert>

        {/* Main Credential Card */}
        <Card className="border-2 shadow-xl overflow-hidden backdrop-blur">
          <CardHeader className="space-y-3 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-full ring-2 ring-primary/20">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">
                    Account Credentials
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    Save these details for future login
                  </CardDescription>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5"
              >
                <span className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                Active
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Downloadable Credential Card */}
            <div
              ref={cardRef}
              className="p-8 bg-gradient-to-br from-card via-card to-muted/30 border-2 border-border rounded-xl shadow-lg space-y-6"
            >
              {/* Card Header */}
              <div className="text-center space-y-2 pb-4 border-b border-border/50">
                <div className="inline-flex p-3 bg-primary/10 rounded-full mb-2">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  User Credentials
                </h3>
                <p className="text-sm text-muted-foreground">
                  Keep this information secure
                </p>
              </div>

              {/* Credentials List */}
              <div className="space-y-4">
                {/* Email Field */}
                <div className="group space-y-2 p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Email Address
                    </span>
                  </div>
                  <p className="text-base font-mono font-medium text-foreground break-all pl-6">
                    {email}
                  </p>
                </div>

                {/* Username Field */}
                <div className="group space-y-2 p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Username
                    </span>
                  </div>
                  <p className="text-base font-mono font-medium text-foreground break-all pl-6">
                    {username}
                  </p>
                </div>

                {/* Password Field */}
                <div className="group space-y-2 p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Key className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Password
                    </span>
                  </div>
                  <p className="text-base font-mono font-medium text-foreground break-all pl-6">
                    {password}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-border/50 text-center">
                <p className="text-xs text-muted-foreground">
                  Generated on{" "}
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={handleDownload}
                size="lg"
                className="w-full gap-2 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Download className="h-5 w-5" />
                Save Credentials
              </Button>

              <Button
                onClick={handleContinueToChat}
                variant="outline"
                size="lg"
                className="w-full gap-2 text-base font-semibold border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                <MessageSquare className="h-5 w-5" />
                Continue to Chat
              </Button>
            </div>

            {/* Security Tips */}
            <div className="pt-4 space-y-2 text-center text-xs text-muted-foreground">
              <p>
                💡 <span className="font-medium">Pro tip:</span> Store this
                image in a secure password manager
              </p>
              <p>🔒 Never share these credentials with anyone</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { SnapshotCard }
