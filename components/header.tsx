"use client"

import { useState } from "react"
import { FileText, Sparkles, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useResume } from "@/lib/resume-context"
import { useToast } from "@/hooks/use-toast"
import { TemplateSelector } from "@/components/template-selector"
import { api } from "@/lib/api"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SignInButton, SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs"
import { Crown, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { SettingsDialog } from "@/components/settings-dialog"
import { ResumeAnalysisDialog } from "@/components/resume-analysis-dialog"

interface HeaderProps {
  currentView: "builder" | "marketplace" | "cover-letter"
  onViewChange: (view: "builder" | "marketplace" | "cover-letter") => void
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  const { data, isPro, hasPurchasedTemplates, template } = useResume()
  const { getToken } = useAuth()
  const { toast } = useToast()
  const [isDownloading, setIsDownloading] = useState(false)

  const handleActivatePremium = async () => {
    const token = await getToken()
    if (!token) {
      // Clerk handles redirect to sign in automatically if we want, or we can show a toast
      toast({
        title: "Authentication Required",
        description: "Please sign in to upgrade to premium.",
      })
      return
    }

    try {
      const { url } = await api.post<{ url: string }>("/checkout", {}, token)
      window.location.href = url
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Could not initiate checkout",
        variant: "destructive",
      })
    }
  }


  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const { pdf } = await import("@react-pdf/renderer")
      const { ResumeDocument } = await import("@/components/resume-document")

      const blob = await pdf(<ResumeDocument data={data} isPremium={hasPurchasedTemplates} template={template} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${data.personalDetails.fullName || "resume"}-cv.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Download Started",
        description: "Your resume is being downloaded.",
      })
    } catch (error) {
      console.log("[v0] PDF generation error:", error)
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <header className="h-16 border-b border-border bg-card px-4 lg:px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
          <FileText className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="font-semibold text-lg text-foreground">ClearVide</span>
        {isPro && (
          <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium flex items-center gap-1">
            <Crown className="w-3 h-3" />
            Pro
          </span>
        )}

        <nav className="ml-8 hidden lg:flex items-center gap-6">
          <button
            onClick={() => onViewChange("builder")}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              currentView === "builder" ? "text-primary" : "text-muted-foreground",
            )}
          >
            Builder
          </button>
          <button
            onClick={() => onViewChange("marketplace")}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5",
              currentView === "marketplace" ? "text-primary" : "text-muted-foreground",
            )}
          >
            Marketplace
            <Badge variant="secondary" className="h-4 px-1 text-[10px] bg-primary/10 text-primary border-none">
              NEW
            </Badge>
          </button>
          <button
            onClick={() => onViewChange("cover-letter")}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5",
              currentView === "cover-letter" ? "text-primary" : "text-muted-foreground",
            )}
          >
            Cover Letter
            <Badge variant="secondary" className="h-4 px-1 text-[10px] bg-amber-100 text-amber-700 border-none">
              PRO
            </Badge>
          </button>
        </nav>
      </div>

      <div className="hidden md:flex ml-auto mr-4">
        {currentView === "builder" && <TemplateSelector />}
      </div>

      <div className="flex items-center gap-2">
        {!hasPurchasedTemplates && (
          <Button variant="outline" size="sm" onClick={handleActivatePremium} className="hidden sm:flex bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 hover:text-amber-700 border-amber-200">
            <Sparkles className="w-4 h-4 mr-1.5 text-amber-500" />
            Remove Watermark
          </Button>
        )}
        <ResumeAnalysisDialog />
        <Button size="sm" onClick={handleDownload} disabled={isDownloading}>
          {isDownloading ? (
            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-1.5" />
          )}
          {isDownloading ? "Generating..." : "Download PDF"}
        </Button>

        <SettingsDialog />
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="ghost" size="sm" className="ml-1">
              <LogIn className="w-4 h-4 mr-1.5" />
              Login
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  )
}
