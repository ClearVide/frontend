"use client"

import { useResume, type ResumeTemplate } from "@/lib/resume-context"
import { cn } from "@/lib/utils"

const templates: { id: ResumeTemplate; name: string; description: string }[] = [
  { id: "classic", name: "Classic", description: "Traditional professional layout" },
  { id: "modern", name: "Modern", description: "Clean sidebar design" },
  { id: "minimal", name: "Minimal", description: "Simple and spacious" },
  { id: "bold", name: "Bold", description: "Strong headers with color" },
]

export function TemplateSelector() {
  const { template, setTemplate } = useResume()

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground hidden lg:inline">Template:</span>
      <div className="flex gap-1 p-1 bg-muted rounded-lg">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => setTemplate(t.id)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
              template === t.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            title={t.description}
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  )
}
