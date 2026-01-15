"use client"

import { Button } from "@/components/ui/button"
import { Layout, Rocket, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function TemplateMarketplace() {
    return (
        <div className="relative overflow-hidden rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
            <div className="absolute top-4 right-4 animate-pulse">
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">
                    <Rocket className="w-3 h-3 mr-1" />
                    Coming Soon
                </Badge>
            </div>

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
                <Layout className="h-10 w-10 text-primary" />
            </div>

            <h3 className="text-2xl font-bold tracking-tight text-foreground mb-3">Template Marketplace</h3>
            <p className="mx-auto max-w-[400px] text-muted-foreground mb-8 text-sm leading-relaxed">
                We're building a marketplace where you can discover and install professional templates designed by top recruiters and designers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 opacity-40 grayscale pointer-events-none select-none">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-[3/4] rounded-lg bg-muted border border-border flex flex-col items-center justify-center p-4">
                        <div className="w-full h-1/2 bg-slate-200 rounded mb-2 animate-pulse" />
                        <div className="w-3/4 h-3 bg-slate-200 rounded mb-1 animate-pulse" />
                        <div className="w-1/2 h-3 bg-slate-200 rounded animate-pulse" />
                    </div>
                ))}
            </div>

            <Button disabled className="gap-2">
                <Sparkles className="h-4 w-4" />
                Join Waitlist
            </Button>

            <p className="mt-4 text-xs text-muted-foreground uppercase tracking-widest font-medium">
                Expected Launch: Q2 2026
            </p>
        </div>
    )
}
