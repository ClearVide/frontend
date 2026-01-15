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
import { Settings, CreditCard, Check, X } from "lucide-react"
import { useResume } from "@/lib/resume-context"
import { useState } from "react"
import { api } from "@/lib/api"
import { useAuth, useUser } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"

export function SettingsDialog() {
    const { isPro, hasPurchasedTemplates } = useResume()
    const { user } = useUser()
    const { getToken } = useAuth()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const handleManageSubscription = async () => {
        setIsLoading(true)
        try {
            const token = await getToken()
            if (!token) return

            // Hypothetical endpoint for customer portal
            const { url } = await api.post<{ url: string }>("/portal", {}, token)
            window.location.href = url
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not open billing portal.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Settings className="w-5 h-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Manage your account and subscription preferences.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/40">
                        <div className="space-y-0.5">
                            <div className="font-medium">User Profile</div>
                            <div className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Plan Status</h4>

                        <div className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${isPro ? "bg-amber-100 text-amber-600" : "bg-muted text-muted-foreground"}`}>
                                    <CreditCard className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="font-medium">Pro Membership</div>
                                    <div className="text-xs text-muted-foreground">AI Features & Unlimited Access</div>
                                </div>
                            </div>
                            {isPro ? (
                                <div className="flex items-center text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded">
                                    <Check className="w-3 h-3 mr-1" /> Active
                                </div>
                            ) : (
                                <div className="flex items-center text-muted-foreground text-xs font-medium bg-muted px-2 py-1 rounded">
                                    <X className="w-3 h-3 mr-1" /> Inactive
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${hasPurchasedTemplates ? "bg-teal-100 text-teal-600" : "bg-muted text-muted-foreground"}`}>
                                    <FileTextIcon className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="font-medium">Template Pack</div>
                                    <div className="text-xs text-muted-foreground">Watermark Removal</div>
                                </div>
                            </div>
                            {hasPurchasedTemplates ? (
                                <div className="flex items-center text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded">
                                    <Check className="w-3 h-3 mr-1" /> Purchased
                                </div>
                            ) : (
                                <div className="flex items-center text-muted-foreground text-xs font-medium bg-muted px-2 py-1 rounded">
                                    <X className="w-3 h-3 mr-1" /> Not Owned
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button onClick={handleManageSubscription} className="w-full" disabled={isLoading || !isPro}>
                            {isLoading ? "Loading..." : "Manage Subscription"}
                        </Button>
                        {!isPro && (
                            <p className="text-xs text-center text-muted-foreground mt-2">
                                Upgrade to Pro to access AI features.
                            </p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
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
