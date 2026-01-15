"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { api } from "@/lib/api"
import { useAuth } from "@clerk/nextjs"

export type ResumeTemplate = "classic" | "modern" | "minimal" | "bold"

export interface PersonalDetails {
  fullName: string
  email: string
  phone: string
  location: string
  linkedIn: string
  website: string
  photo: string
}

export interface Employment {
  id: string
  jobTitle: string
  company: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Education {
  id: string
  degree: string
  institution: string
  startDate: string
  endDate: string
  description: string
}

export interface ResumeData {
  personalDetails: PersonalDetails
  summary: string
  employment: Employment[]
  education: Education[]
  skills: string[]
  languages: string[]
}


interface ResumeContextType {
  data: ResumeData
  updatePersonalDetails: (details: Partial<PersonalDetails>) => void
  updateSummary: (summary: string) => void
  addEmployment: () => void
  updateEmployment: (id: string, employment: Partial<Employment>) => void
  removeEmployment: (id: string) => void
  addEducation: () => void
  updateEducation: (id: string, education: Partial<Education>) => void
  removeEducation: (id: string) => void
  updateSkills: (skills: string[]) => void
  updateLanguages: (languages: string[]) => void
  isPro: boolean
  setIsPro: (value: boolean) => void
  hasPurchasedTemplates: boolean
  setHasPurchasedTemplates: (value: boolean) => void
  template: ResumeTemplate
  setTemplate: (template: ResumeTemplate) => void
}
const defaultData: ResumeData = {
  personalDetails: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedIn: "",
    website: "",
    photo: "",
  },
  summary: "",
  employment: [],
  education: [],
  skills: [],
  languages: [],
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined)

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ResumeData>(defaultData)
  const [isPro, setIsPro] = useState(false)
  const [hasPurchasedTemplates, setHasPurchasedTemplates] = useState(false)
  const [template, setTemplate] = useState<ResumeTemplate>("classic")
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("resumeData")
    const savedPro = localStorage.getItem("isPro")
    const savedTemplates = localStorage.getItem("hasPurchasedTemplates")
    const savedTemplate = localStorage.getItem("resumeTemplate")

    if (saved) {
      try {
        setData(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse saved resume data")
      }
    }
    if (savedPro) {
      setIsPro(savedPro === "true")
    }
    if (savedTemplates) {
      setHasPurchasedTemplates(savedTemplates === "true")
    }
    if (savedTemplate && ["classic", "modern", "minimal", "bold"].includes(savedTemplate)) {
      setTemplate(savedTemplate as ResumeTemplate)
    }
    setIsLoaded(true)
  }, [])

  // Check premium status from backend
  const { getToken, isLoaded: isClerkLoaded, isSignedIn } = useAuth()

  useEffect(() => {
    async function checkPremium() {
      if (!isClerkLoaded || !isSignedIn) {
        setIsPro(false)
        setHasPurchasedTemplates(false)
        return
      }

      try {
        const token = await getToken()
        if (!token) return

        // Assuming /api/me returns { isPro: boolean, hasPurchasedTemplates: boolean }
        const user = await api.get<{ isPro: boolean; hasPurchasedTemplates: boolean }>("/me", token)
        setIsPro(user.isPro)
        setHasPurchasedTemplates(user.hasPurchasedTemplates)
        localStorage.setItem("isPro", String(user.isPro))
        localStorage.setItem("hasPurchasedTemplates", String(user.hasPurchasedTemplates))
      } catch (error: any) {
        // If 401, it just means the session is invalid or expired, so treated as non-premium.
        // We log it as info rather than error to avoid console noise for logged out state transitions.
        if (error.message?.includes("Unauthorized") || error.message?.includes("401")) {
          setIsPro(false)
          setHasPurchasedTemplates(false)
          return
        }
        console.error("Failed to check premium status:", error)
      }
    }

    checkPremium()
  }, [isClerkLoaded, isSignedIn, getToken])

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("resumeData", JSON.stringify(data))
    }
  }, [data, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("isPro", String(isPro))
    }
  }, [isPro, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("hasPurchasedTemplates", String(hasPurchasedTemplates))
    }
  }, [hasPurchasedTemplates, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("resumeTemplate", template)
    }
  }, [template, isLoaded])

  const updatePersonalDetails = useCallback((details: Partial<PersonalDetails>) => {
    setData((prev) => ({
      ...prev,
      personalDetails: { ...prev.personalDetails, ...details },
    }))
  }, [])

  const updateSummary = useCallback((summary: string) => {
    setData((prev) => ({ ...prev, summary }))
  }, [])

  const addEmployment = useCallback(() => {
    const newEmployment: Employment = {
      id: crypto.randomUUID(),
      jobTitle: "",
      company: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    setData((prev) => ({
      ...prev,
      employment: [...prev.employment, newEmployment],
    }))
  }, [])

  const updateEmployment = useCallback((id: string, employment: Partial<Employment>) => {
    setData((prev) => ({
      ...prev,
      employment: prev.employment.map((emp) => (emp.id === id ? { ...emp, ...employment } : emp)),
    }))
  }, [])

  const removeEmployment = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      employment: prev.employment.filter((emp) => emp.id !== id),
    }))
  }, [])

  const addEducation = useCallback(() => {
    const newEducation: Education = {
      id: crypto.randomUUID(),
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      description: "",
    }
    setData((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }))
  }, [])

  const updateEducation = useCallback((id: string, education: Partial<Education>) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, ...education } : edu)),
    }))
  }, [])

  const removeEducation = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }))
  }, [])

  const updateSkills = useCallback((skills: string[]) => {
    setData((prev) => ({ ...prev, skills }))
  }, [])

  const updateLanguages = useCallback((languages: string[]) => {
    setData((prev) => ({ ...prev, languages }))
  }, [])


  return (
    <ResumeContext.Provider
      value={{
        data,
        updatePersonalDetails,
        updateSummary,
        addEmployment,
        updateEmployment,
        removeEmployment,
        addEducation,
        updateEducation,
        removeEducation,
        updateSkills,
        updateLanguages,
        isPro,
        setIsPro,
        hasPurchasedTemplates,
        setHasPurchasedTemplates,
        template,
        setTemplate,
      }}
    >
      {children}
    </ResumeContext.Provider>
  )
}

export function useResume() {
  const context = useContext(ResumeContext)
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider")
  }
  return context
}
