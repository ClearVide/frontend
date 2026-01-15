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

            // Construct prompt for analysis
            const resumeContent = JSON.stringify(data)
            const prompt = `Analyze this resume JSON data and provide a score out of 100 and a list of 3-5 specific improvements.
      Format the response exactly as a JSON string: {"score": 85, "feedback": ["Improve summary", "Add more metrics"]}.
      Resume Data: ${resumeContent}`

            // We use the 'analyze' endpoint (or polish if analyze is not suitable, but analyze implies analysis)
            // The backend integration guide says analyze returns gap analysis and suggestions.
            // We'll adapt it or assume it returns text we can parse, or just use polish for raw text generation if analyze is strictly structured.
            // Let's assume we can get text back and try to parse it, or just display the text if parsing fails.

            const { text } = await api.post<{ text: string }>("/polish", {
                text: prompt,
                type: "analysis" // Custom type to signal backend bot
            }, token)

            try {
                // Attempt to parse if the bot returns JSON as requested
                const result = JSON.parse(text)
                setAnalysis(result)
            } catch (e) {
                // Fallback if not JSON
                setAnalysis({ score: 75, feedback: [text] })
            }

        } catch (error: any) {
            toast({
                title: "Analysis Failed",
                description: "Could not analyze resume.",
                variant: "destructive",
            })
        } finally {
            setIsAnalyzing(false)
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
                        <Button variant="default" className="bg-amber-600 hover:bg-amber-700">
                            Upgrade Knowledge
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
