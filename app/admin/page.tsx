"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Shield, Users, Crown, FileText, Loader2, RefreshCw } from "lucide-react"

interface User {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    createdAt: number
    isPro: boolean
    hasPurchasedTemplates: boolean
    stripeSubscriptionId: string | null
}



export default function AdminPage() {
    const { user, isLoaded } = useUser()
    const { getToken } = useAuth()
    const router = useRouter()
    const { toast } = useToast()

    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)





    const fetchUsers = async () => {
        setIsLoading(true)
        try {
            const token = await getToken()
            if (!token) return
            const data = await api.get<{ users: User[] }>("/admin/users", token)
            setUsers(data.users)
        } catch (error: any) {
            if (error.message?.includes("Forbidden") || error.message?.includes("Unauthorized")) {
                router.push("/")
                return
            }
            toast({
                title: "Error",
                description: "Failed to fetch users",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isLoaded && user) {
            fetchUsers()
        }
    }, [isLoaded, user])

    const handleToggle = async (userId: string, field: "isPro" | "hasPurchasedTemplates", currentValue: boolean) => {
        setUpdatingUserId(userId)
        try {
            const token = await getToken()
            if (!token) return

            const userToUpdate = users.find(u => u.id === userId)
            if (!userToUpdate) return

            const payload = {
                isPro: field === "isPro" ? !currentValue : userToUpdate.isPro,
                hasPurchasedTemplates: field === "hasPurchasedTemplates" ? !currentValue : userToUpdate.hasPurchasedTemplates,
            }

            const { user: updatedUser } = await api.patch<{ user: User }>(`/admin/users/${userId}`, payload, token)

            setUsers(prevUsers => prevUsers.map(u =>
                u.id === userId ? updatedUser : u
            ))

            toast({
                title: "Updated",
                description: `User ${field} updated successfully`,
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update user",
                variant: "destructive",
            })
        } finally {
            setUpdatingUserId(null)
        }
    }

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border bg-card px-6 py-4">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Admin Panel</h1>
                            <p className="text-sm text-muted-foreground">Manage users and subscriptions</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={fetchUsers} disabled={isLoading}>
                            <RefreshCw className={`w-4 h-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
                            Back to App
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">Users ({users.length})</h2>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">User</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Email</th>
                                    <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">
                                        <div className="flex items-center justify-center gap-1">
                                            <Crown className="w-4 h-4 text-amber-500" />
                                            Pro
                                        </div>
                                    </th>
                                    <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">
                                        <div className="flex items-center justify-center gap-1">
                                            <FileText className="w-4 h-4 text-teal-500" />
                                            Templates
                                        </div>
                                    </th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-muted/30">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-sm">
                                                {u.firstName || u.lastName
                                                    ? `${u.firstName || ''} ${u.lastName || ''}`.trim()
                                                    : 'No name'}
                                            </div>
                                            <div className="text-xs text-muted-foreground font-mono">{u.id.slice(0, 12)}...</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{u.email}</td>
                                        <td className="px-4 py-3 text-center">
                                            <Switch
                                                checked={u.isPro}
                                                onCheckedChange={() => handleToggle(u.id, "isPro", u.isPro)}
                                                disabled={updatingUserId === u.id}
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Switch
                                                checked={u.hasPurchasedTemplates}
                                                onCheckedChange={() => handleToggle(u.id, "hasPurchasedTemplates", u.hasPurchasedTemplates)}
                                                disabled={updatingUserId === u.id}
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    )
}
