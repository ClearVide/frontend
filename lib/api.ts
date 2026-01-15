const BASE_URL = "/api"

async function request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string | null
): Promise<T> {
    const headers = new Headers(options.headers)
    headers.set("Content-Type", "application/json")

    if (token) {
        headers.set("Authorization", `Bearer ${token}`)
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }))
        throw new Error(error.message || response.statusText)
    }

    return response.json()
}

export const api = {
    get: <T>(endpoint: string, token?: string | null) => request<T>(endpoint, {}, token),
    post: <T>(endpoint: string, body: any, token?: string | null) =>
        request<T>(endpoint, {
            method: "POST",
            body: JSON.stringify(body),
        }, token),
}
