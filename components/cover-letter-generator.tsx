"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useResume } from "@/lib/resume-context"
import { api } from "@/lib/api"
import { useAuth } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Sparkles, Copy, Check, Crown } from "lucide-react"

export function CoverLetterGenerator() {
    const { data, isPro } = useResume()
    const { getToken } = useAuth()
    const { toast } = useToast()

    const [jobTitle, setJobTitle] = useState("")
    const [company, setCompany] = useState("")
    const [jobDescription, setJobDescription] = useState("")
    const [generatedLetter, setGeneratedLetter] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [hasCopied, setHasCopied] = useState(false)

    const handleGenerate = async () => {
        if (!isPro) {
            toast({
                title: "Pro Feature",
                description: "Upgrade to Pro to generate unlimited cover letters.",
                variant: "destructive"
            })
            return
        }

        if (!jobTitle || !company) {
            toast({
                title: "Missing Information",
                description: "Please enter a job title and company name.",
                variant: "destructive",
            })
            return
        }

        setIsGenerating(true)
        try {
            const token = await getToken()
            if (!token) return

            // Construct a rich prompt using resume data
            const resumeContext = `
        Name: ${data.personalDetails.fullName}
        Skills: ${data.skills.join(", ")}
        Experience: ${data.employment.map(e => `${e.jobTitle} at ${e.company} (${e.description})`).join("; ")}
      `

            const prompt = `Write a professional cover letter for a ${jobTitle} position at ${company}. 
      Target Job Description: ${jobDescription}
      
      My Resume Details:
      ${resumeContext}
      
      Keep it professional, engaging, and highlight relevant skills matching the job description.`

            const { text } = await api.post<{ text: string }>("/polish", {
                text: prompt,
                type: "cover-letter" // Using 'polish' endpoint but with custom type/prompt
            }, token)

            setGeneratedLetter(text)
        } catch (error: any) {
            toast({
                title: "Generation Failed",
                description: error.message || "Could not generate cover letter.",
                variant: "destructive",
            })
        } finally {
            setIsGenerating(false)
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLetter)
        setHasCopied(true)
        setTimeout(() => setHasCopied(false), 2000)
        toast({
            title: "Copied",
            description: "Cover letter copied to clipboard.",
        })
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Cover Letter Generator</h2>
                <p className="text-muted-foreground">
                    Create a tailored cover letter in seconds using AI.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Job Details</CardTitle>
                        <CardDescription>
                            Tell us about the job you're applying for.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Job Title</Label>
                            <Input
                                placeholder="e.g. Senior Frontend Developer"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Company Name</Label>
                            <Input
                                placeholder="e.g. Acme Corp"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Job Description (Optional)</Label>
                            <Textarea
                                placeholder="Paste the job description here to tailor the letter..."
                                className="min-h-[150px]"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={handleGenerate} disabled={isGenerating}>
                            {isGenerating ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : !isPro ? (
                                <Crown className="w-4 h-4 mr-2 text-amber-500" />
                            ) : (
                                <Sparkles className="w-4 h-4 mr-2" />
                            )}
                            Generate Cover Letter
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Your Cover Letter</CardTitle>
                        <CardDescription>
                            AI-generated content will appear here. Edit or copy it.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-[400px]">
                        {generatedLetter ? (
                            <Textarea
                                value={generatedLetter}
                                onChange={(e) => setGeneratedLetter(e.target.value)}
                                className="h-full min-h-[350px] font-serif text-sm leading-relaxed p-4 bg-muted/20"
                            />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
                                <FileTextIcon className="w-12 h-12 mb-4 opacity-20" />
                                <p>Fill in the details and click Generate</p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="justify-end">
                        <Button variant="outline" onClick={handleCopy} disabled={!generatedLetter}>
                            {hasCopied ? (
                                <Check className="w-4 h-4 mr-2" />
                            ) : (
                                <Copy className="w-4 h-4 mr-2" />
                            )}
                            Copy to Clipboard
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

function FileTextIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <line x1="10" x2="8" y1="9" y2="9" />
        </svg>
    )
}
