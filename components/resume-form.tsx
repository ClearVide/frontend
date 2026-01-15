"use client"

import { User, FileText, Briefcase, GraduationCap, Wrench, Globe, Plus, Trash2, Sparkles, Loader2, Crown, ImagePlus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useResume } from "@/lib/resume-context"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { useAuth } from "@clerk/nextjs"
import { AIPolishDialog, AIPolishType } from "./ai-polish-dialog"

export function ResumeForm() {
  const {
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
  } = useResume()

  const { getToken } = useAuth()

  const { toast } = useToast()

  const [skillInput, setSkillInput] = useState("")
  const [languageInput, setLanguageInput] = useState("")

  const [polishDialogState, setPolishDialogState] = useState<{
    isOpen: boolean
    type: AIPolishType
    context: any
    onSuccess: (result: any) => void
  }>({
    isOpen: false,
    type: "summary",
    context: {},
    onSuccess: () => { },
  })

  const handleAddSkill = () => {
    if (skillInput.trim() && !data.skills.includes(skillInput.trim())) {
      updateSkills([...data.skills, skillInput.trim()])
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    updateSkills(data.skills.filter((s) => s !== skill))
  }

  const handleAddLanguage = () => {
    if (languageInput.trim() && !data.languages.includes(languageInput.trim())) {
      updateLanguages([...data.languages, languageInput.trim()])
      setLanguageInput("")
    }
  }

  const handleRemoveLanguage = (language: string) => {
    updateLanguages(data.languages.filter((l) => l !== language))
  }

  const handleGenerateSummary = async () => {
    const token = await getToken()
    if (!token) {
      toast({
        title: "Login Required",
        description: "Please login to use AI features.",
      })
      return
    }

    if (!isPro) {
      toast({
        title: "Pro Feature",
        description: "AI summary generation is available for Pro users only.",
      })
      return
    }

    const jobTitles = data.employment.map((e) => e.jobTitle).filter(Boolean)
    const content = {
      name: data.personalDetails.fullName,
      jobTitles: jobTitles,
      skills: data.skills
    }

    setPolishDialogState({
      isOpen: true,
      type: "summary",
      context: content,
      onSuccess: (refinedContent) => updateSummary(refinedContent)
    })
  }

  const handleGenerateJobDescription = async (empId: string, jobTitle: string, company: string) => {
    if (!jobTitle) return

    const token = await getToken()
    if (!token) {
      toast({
        title: "Login Required",
        description: "Please login to use AI features.",
      })
      return
    }

    if (!isPro) {
      toast({
        title: "Pro Feature",
        description: "AI job description generation is available for Pro users only.",
      })
      return
    }

    // We open the dialog.
    const content = {
      jobTitle: jobTitle,
      company: company
    }

    setPolishDialogState({
      isOpen: true,
      type: "experience",
      context: content,
      onSuccess: (refinedContent) => updateEmployment(empId, { description: refinedContent })
    })
  }

  const handleSuggestSkills = async () => {
    const jobTitles = data.employment.map((e) => e.jobTitle).filter(Boolean)
    if (jobTitles.length === 0) return

    const token = await getToken()
    if (!token) {
      toast({
        title: "Login Required",
        description: "Please login to use AI features.",
      })
      return
    }

    if (!isPro) {
      toast({
        title: "Pro Feature",
        description: "AI skill suggestions are available for Pro users only.",
      })
      return
    }

    const content = {
      jobTitles: jobTitles,
      existingSkills: data.skills
    }

    setPolishDialogState({
      isOpen: true,
      type: "skill-suggestions",
      context: content,
      onSuccess: (refinedContent) => {
        if (refinedContent && Array.isArray(refinedContent)) {
          updateSkills([...data.skills, ...refinedContent.filter((s: string) => !data.skills.includes(s))])
        }
      }
    })
  }


  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Build Your Resume</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in the sections below. Your changes will appear instantly in the preview.
        </p>
      </div>

      <Accordion type="multiple" defaultValue={["personal", "summary"]} className="space-y-3">
        {/* Personal Details */}
        <AccordionItem value="personal" className="border rounded-lg bg-background px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium">Personal Details</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="grid gap-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-lg border-2 border-dashed border-border bg-muted flex items-center justify-center overflow-hidden">
                    {data.personalDetails.photo ? (
                      <img src={data.personalDetails.photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <ImagePlus className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          updatePersonalDetails({ photo: reader.result as string })
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                  {data.personalDetails.photo && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        updatePersonalDetails({ photo: "" })
                      }}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm hover:bg-destructive/90"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="text-sm font-medium">Profile Photo</h4>
                  <p className="text-xs text-muted-foreground">
                    Upload a professional headshot. JPEG or PNG, max 2MB.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={data.personalDetails.fullName}
                    onChange={(e) => updatePersonalDetails({ fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={data.personalDetails.email}
                    onChange={(e) => updatePersonalDetails({ email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+1 234 567 890"
                    value={data.personalDetails.phone}
                    onChange={(e) => updatePersonalDetails({ phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="New York, NY"
                    value={data.personalDetails.location}
                    onChange={(e) => updatePersonalDetails({ location: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedIn">LinkedIn</Label>
                  <Input
                    id="linkedIn"
                    placeholder="linkedin.com/in/johndoe"
                    value={data.personalDetails.linkedIn}
                    onChange={(e) => updatePersonalDetails({ linkedIn: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="johndoe.com"
                    value={data.personalDetails.website}
                    onChange={(e) => updatePersonalDetails({ website: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Professional Summary */}
        <AccordionItem value="summary" className="border rounded-lg bg-background px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium">Professional Summary</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="summary">Summary</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateSummary}
                  className="text-xs h-7 gap-1.5 text-primary hover:text-primary"
                >
                  {!isPro ? (
                    <Crown className="w-3 h-3 text-amber-500" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  Generate with AI
                </Button>
              </div>
              <Textarea
                id="summary"
                placeholder="A brief description of your professional background and career objectives..."
                className="min-h-[120px] resize-none"
                value={data.summary}
                onChange={(e) => updateSummary(e.target.value)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Employment History */}
        <AccordionItem value="employment" className="border rounded-lg bg-background px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                <Briefcase className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium">Employment History</span>
              {data.employment.length > 0 && (
                <span className="ml-auto mr-2 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                  {data.employment.length}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-4">
              {data.employment.map((emp, index) => (
                <div key={emp.id} className="p-4 border rounded-lg bg-muted/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Position {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeEmployment(emp.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input
                        placeholder="Software Engineer"
                        value={emp.jobTitle}
                        onChange={(e) => updateEmployment(emp.id, { jobTitle: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input
                        placeholder="Google Inc."
                        value={emp.company}
                        onChange={(e) => updateEmployment(emp.id, { company: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        placeholder="Jan 2020"
                        value={emp.startDate}
                        onChange={(e) => updateEmployment(emp.id, { startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        placeholder="Dec 2023"
                        value={emp.endDate}
                        onChange={(e) => updateEmployment(emp.id, { endDate: e.target.value })}
                        disabled={emp.current}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`current-${emp.id}`}
                      checked={emp.current}
                      onCheckedChange={(checked) =>
                        updateEmployment(emp.id, { current: !!checked, endDate: checked ? "Present" : "" })
                      }
                    />
                    <Label htmlFor={`current-${emp.id}`} className="text-sm font-normal">
                      I currently work here
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Description</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleGenerateJobDescription(emp.id, emp.jobTitle, emp.company)}
                        disabled={!emp.jobTitle}
                        className="text-xs h-7 gap-1.5 text-primary hover:text-primary"
                      >
                        {!isPro ? (
                          <Crown className="w-3 h-3 text-amber-500" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        Generate with AI
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Describe your responsibilities and achievements..."
                      className="min-h-[80px] resize-none"
                      value={emp.description}
                      onChange={(e) => updateEmployment(emp.id, { description: e.target.value })}
                    />
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent" onClick={addEmployment}>
                <Plus className="w-4 h-4 mr-2" />
                Add Employment
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Education */}
        <AccordionItem value="education" className="border rounded-lg bg-background px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                <GraduationCap className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium">Education</span>
              {data.education.length > 0 && (
                <span className="ml-auto mr-2 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                  {data.education.length}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={edu.id} className="p-4 border rounded-lg bg-muted/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Education {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeEducation(edu.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Degree</Label>
                      <Input
                        placeholder="Bachelor of Science"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Institution</Label>
                      <Input
                        placeholder="MIT"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        placeholder="Sep 2016"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        placeholder="Jun 2020"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description (Optional)</Label>
                    <Textarea
                      placeholder="Relevant coursework, honors, activities..."
                      className="min-h-[60px] resize-none"
                      value={edu.description}
                      onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                    />
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent" onClick={addEducation}>
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem value="skills" className="border rounded-lg bg-background px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                <Wrench className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium">Skills</span>
              {data.skills.length > 0 && (
                <span className="ml-auto mr-2 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                  {data.skills.length}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill (e.g., JavaScript)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                />
                <Button onClick={handleAddSkill} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {data.employment.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSuggestSkills}
                  className="w-full gap-1.5 bg-transparent"
                >
                  {!isPro ? (
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  Suggest skills based on your experience
                </Button>
              )}
              {data.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Languages */}
        <AccordionItem value="languages" className="border rounded-lg bg-background px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                <Globe className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium">Languages</span>
              {data.languages.length > 0 && (
                <span className="ml-auto mr-2 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                  {data.languages.length}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a language (e.g., English - Native)"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddLanguage())}
                />
                <Button onClick={handleAddLanguage} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {data.languages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.languages.map((language) => (
                    <span
                      key={language}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm"
                    >
                      {language}
                      <button
                        onClick={() => handleRemoveLanguage(language)}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <AIPolishDialog
        isOpen={polishDialogState.isOpen}
        onOpenChange={(open) => setPolishDialogState(prev => ({ ...prev, isOpen: open }))}
        type={polishDialogState.type}
        context={polishDialogState.context}
        onSuccess={polishDialogState.onSuccess}
      />
    </div>
  )
}
