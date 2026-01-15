"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Sparkles, Loader2, Wand2 } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { useAuth } from "@clerk/nextjs"

export type AIPolishType = "summary" | "experience" | "cover-letter" | "skill-suggestions"

interface AIPolishDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    type: AIPolishType
    context: any
    onSuccess: (result: any) => void
}

export function AIPolishDialog({
    isOpen,
    onOpenChange,
    type,
    context,
    onSuccess,
}: AIPolishDialogProps) {
    const [instruction, setInstruction] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const { getToken } = useAuth()

    const getTitle = () => {
        switch (type) {
            case "summary":
                return "Generate Professional Summary"
            case "experience":
                return "Enhance Experience Description"
            case "cover-letter":
                return "Write Cover Letter"
            case "skill-suggestions":
                return "Suggest Skills"
            default:
                return "AI Assistant"
        }
    }

    const getDescription = () => {
        switch (type) {
            case "summary":
                return "Let AI write a compelling summary based on your experience."
            case "experience":
                return "Turn your responsibilities into impactful achievements."
            case "cover-letter":
                return "Create a tailored cover letter for your target role."
            case "skill-suggestions":
                return "Discover relevant skills to boost your resume."
            default:
                return "How can AI help you today?"
        }
    }

    const handleGenerate = async () => {
        setIsLoading(true)
        try {
            const token = await getToken()
            if (!token) {
                throw new Error("You must be logged in")
            }

            // Prepare payload - context is stringified as per backend expectation in existing code
            const payload = {
                type,
                content: JSON.stringify(context),
                context: instruction // This is the "Instruction" part passed to backend
            }

            const response = await api.post<{ refinedContent: any }>("/polish", payload, token)

            onSuccess(response.refinedContent)
            onOpenChange(false)
            setInstruction("")

            toast({
                title: "Content Generated",
                description: "Your content has been updated successfully.",
            })
        } catch (error: any) {
            console.error(error)
            toast({
                title: "Generation Failed",
                description: error.message || "Something went wrong. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        {getTitle()}
                    </DialogTitle>
                    <DialogDescription>
                        {getDescription()}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="instruction">
                            Custom Instructions (Optional)
                        </Label>
                        <Textarea
                            id="instruction"
                            placeholder={
                                type === "experience"
                                    ? "e.g., Focus on leadership and project management exp..."
                                    : "e.g., Make it sound more senior, emphasize backend skills..."
                            }
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            className="resize-none min-h-[100px]"
                        />
                        <p className="text-xs text-muted-foreground">
                            Leave empty to let AI decide the best approach based on your profile.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleGenerate} disabled={isLoading} className="gap-2">
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-4 h-4" /> Generate
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
