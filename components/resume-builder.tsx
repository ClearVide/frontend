"use client"

import { useState } from "react"
import { ResumeProvider } from "@/lib/resume-context"
import { ResumeForm } from "@/components/resume-form"
import { ResumePreview } from "@/components/resume-preview"
import { Header } from "@/components/header"
import { TemplateMarketplace } from "@/components/template-marketplace"
import { CoverLetterGenerator } from "@/components/cover-letter-generator"

export default function ResumeBuilder() {
  const [view, setView] = useState<"builder" | "marketplace" | "cover-letter">("builder")

  return (
    <ResumeProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <Header currentView={view} onViewChange={setView} />
        <main className="flex-1 flex flex-col">
          {view === "builder" ? (
            <div className="flex flex-col lg:flex-row flex-1">
              {/* Left Side - Editor */}
              <aside className="w-full lg:w-[480px] xl:w-[520px] border-r border-border bg-card overflow-y-auto lg:h-[calc(100vh-64px)]">
                <ResumeForm />
              </aside>

              {/* Right Side - Live Preview */}
              <section className="flex-1 bg-muted/50 p-4 lg:p-8 overflow-y-auto lg:h-[calc(100vh-64px)]">
                <ResumePreview />
              </section>
            </div>
          ) : view === "marketplace" ? (
            <div className="p-4 lg:p-12 max-w-6xl mx-auto w-full">
              <TemplateMarketplace />
            </div>
          ) : (
            <div className="flex-1 bg-muted/30">
              <CoverLetterGenerator />
            </div>
          )}
        </main>
      </div>
    </ResumeProvider>
  )
}
