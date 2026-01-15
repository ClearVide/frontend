"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BarChart, CheckCircle2, AlertCircle, Loader2, Sparkles, Crown } from "lucide-react"
import { useResume } from "@/lib/resume-context"
import { useState } from "react"
import { api } from "@/lib/api"
import { useAuth } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

export function ResumeAnalysisDialog() {
    const { data, isPro } = useResume()
    const { getToken } = useAuth()
    const { toast } = useToast()

    const [isOpen, setIsOpen] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysis, setAnalysis] = useState<{ score: number; feedback: string[] } | null>(null)

    const handleAnalyze = async () => {
        if (!isPro) {
            toast({
                title: "Pro Feature",
                description: "Detailed resume analysis is available for Pro users.",
            })
            return
        }

        setIsAnalyzing(true)
        try {
            const token = await getToken()
            if (!token) return

            // Map frontend data structure to backend expectation
            const payload = {
                personalDetails: {
                    ...data.personalDetails,
                    // Backend might expect jobTitle/targetRoles in personalDetails or separate?
                    // Docs: "jobTitle", "targetRoles". Frontend has "jobTitle" in employment usually.
                    // We'll pass what we have.
                },
                experience: data.employment.map(emp => ({
                    company: emp.company,
                    role: emp.jobTitle,
                    duration: `${emp.startDate} - ${emp.endDate || 'Present'}`,
                    bullets: emp.description ? emp.description.split('\n').filter(line => line.trim().length > 0) : []
                })),
                education: data.education.map(edu => ({
                    institution: edu.institution,
                    degree: edu.degree,
                    duration: `${edu.startDate} - ${edu.endDate}`
                })),
                skills: data.skills
            }

            // Call the external backend
            const response = await api.post<{
                summary: string;
                gapAnalysis: string[];
                proactiveSuggestions: string[];
            }>("/analyze", payload, token)

            // Calculate a synthetic score based on feedback count (fewer gaps = higher score)
            // Base 100, deduct 5 for each gap.
            const syntheticScore = Math.max(100 - (response.gapAnalysis.length * 5), 60)

            // Combine gap analysis and suggestions for feedback display
            const combinedFeedback = [
                ...response.gapAnalysis,
                ...response.proactiveSuggestions
            ].slice(0, 5) // Limit to 5 items

            setAnalysis({
                score: syntheticScore,
                feedback: combinedFeedback.length > 0 ? combinedFeedback : ["Great job! Your resume looks solid."]
            })

            toast({
                title: "Analysis Complete",
                description: "Your resume has been analyzed successfully.",
            })

        } catch (error: any) {
            console.error(error)
            toast({
                title: "Analysis Failed",
                description: "Could not analyze resume. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsAnalyzing(false)
        }
    }

    const handleUpgrade = async () => {
        const token = await getToken()
        if (!token) {
            toast({ title: "Please sign in" })
            return
        }
        try {
            const { url } = await api.post<{ url: string }>("/checkout", { plan: "pro" }, token)
            window.location.href = url
        } catch (e) {
            toast({ title: "Error", description: "Failed to start checkout", variant: "destructive" })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="hidden lg:flex gap-1.5" onClick={() => setIsOpen(true)}>
                    <BarChart className="w-4 h-4" />
                    Score
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Resume Score & Analysis</DialogTitle>
                    <DialogDescription>
                        Get AI-powered feedback to improve your resume impact.
                    </DialogDescription>
                </DialogHeader>

                {!isPro ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                        <div className="p-4 bg-amber-100 rounded-full">
                            <Crown className="w-8 h-8 text-amber-600" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">Pro Feature</h3>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                Upgrade to Pro to unlock detailed resume scoring and personalized improvement suggestions.
                            </p>
                        </div>
                        <Button onClick={handleUpgrade} variant="default" className="bg-amber-600 hover:bg-amber-700">
                            Upgrade to Pro
                        </Button>
                    </div>
                ) : !analysis ? (
                    <div className="py-6 flex flex-col items-center justify-center">
                        <p className="text-center text-muted-foreground mb-6">
                            Click analyze to get a comprehensive review of your resume's content, formatting, and impact.
                        </p>
                        <Button onClick={handleAnalyze} disabled={isAnalyzing} size="lg" className="w-full max-w-xs">
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" /> Analyze Resume
                                </>
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-muted-foreground">Overall Score</span>
                                <span className="font-bold text-2xl">{analysis.score}/100</span>
                            </div>
                            <Progress value={analysis.score} className="h-3" />
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-medium flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                Improvements Needed
                            </h4>
                            <ul className="space-y-2">
                                {analysis.feedback.map((item, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-slate-700 bg-muted/50 p-2 rounded">
                                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Button onClick={handleAnalyze} variant="outline" className="w-full">
                            Re-Analyze
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
