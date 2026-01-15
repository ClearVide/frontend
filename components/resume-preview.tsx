"use client"

import { useResume } from "@/lib/resume-context"
import { TemplateSelector } from "@/components/template-selector"

export function ResumePreview() {
  const { data, hasPurchasedTemplates, template } = useResume()
  const { personalDetails, summary, employment, education, skills, languages } = data

  const hasContactInfo = !!(
    personalDetails.email ||
    personalDetails.phone ||
    personalDetails.location ||
    personalDetails.linkedIn ||
    personalDetails.website
  )

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Live Preview</h3>
        <div className="flex items-center gap-3">
          {/* Mobile template selector */}
          <div className="md:hidden">
            <TemplateSelector />
          </div>
          {!hasPurchasedTemplates && (
            <span className="text-xs text-muted-foreground hidden sm:inline">Watermark visible (Free version)</span>
          )}
        </div>
      </div>
      <div className="flex-1 bg-white rounded-xl border border-border shadow-sm overflow-auto min-h-[600px] lg:min-h-0">
        {template === "classic" && (
          <ClassicTemplate
            personalDetails={personalDetails}
            summary={summary}
            employment={employment}
            education={education}
            skills={skills}
            languages={languages}
            hasContactInfo={hasContactInfo}
            isPremium={hasPurchasedTemplates}
          />
        )}
        {template === "modern" && (
          <ModernTemplate
            personalDetails={personalDetails}
            summary={summary}
            employment={employment}
            education={education}
            skills={skills}
            languages={languages}
            hasContactInfo={hasContactInfo}
            isPremium={hasPurchasedTemplates}
          />
        )}
        {template === "minimal" && (
          <MinimalTemplate
            personalDetails={personalDetails}
            summary={summary}
            employment={employment}
            education={education}
            skills={skills}
            languages={languages}
            hasContactInfo={hasContactInfo}
            isPremium={hasPurchasedTemplates}
          />
        )}
        {template === "bold" && (
          <BoldTemplate
            personalDetails={personalDetails}
            summary={summary}
            employment={employment}
            education={education}
            skills={skills}
            languages={languages}
            hasContactInfo={hasContactInfo}
            isPremium={hasPurchasedTemplates}
          />
        )}
      </div>
    </div>
  )
}

interface TemplateProps {
  personalDetails: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedIn: string
    website: string
    photo: string
  }
  summary: string
  employment: Array<{
    id: string
    jobTitle: string
    company: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  education: Array<{
    id: string
    degree: string
    institution: string
    startDate: string
    endDate: string
    description: string
  }>
  skills: string[]
  languages: string[]
  hasContactInfo: boolean
  isPremium: boolean
}

// Classic Template - Traditional professional look
function ClassicTemplate({
  personalDetails,
  summary,
  employment,
  education,
  skills,
  languages,
  hasContactInfo,
  isPremium,
}: TemplateProps) {
  return (
    <div className="p-8 min-h-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 mb-5">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 mb-1.5 tracking-wide">
            {personalDetails.fullName || "Your Name"}
          </h1>
          {hasContactInfo && (
            <div className="flex flex-wrap gap-3 text-xs text-slate-600">
              {personalDetails.email && <span>{personalDetails.email}</span>}
              {personalDetails.phone && <span>{personalDetails.phone}</span>}
              {personalDetails.location && <span>{personalDetails.location}</span>}
              {personalDetails.linkedIn && <span>{personalDetails.linkedIn}</span>}
              {personalDetails.website && <span>{personalDetails.website}</span>}
            </div>
          )}
        </div>
        {personalDetails.photo && (
          <div className="w-20 h-20 ml-4 rounded overflow-hidden flex-shrink-0 border border-slate-200">
            <img src={personalDetails.photo} alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {summary && (
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {employment.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">
            Employment History
          </h2>
          {employment.map((emp) => (
            <div key={emp.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">{emp.jobTitle || "Job Title"}</h3>
                  <p className="text-xs text-slate-600">{emp.company || "Company"}</p>
                </div>
                <span className="text-xs text-slate-500">
                  {emp.startDate || "Start"} — {emp.current ? "Present" : emp.endDate || "End"}
                </span>
              </div>
              {emp.description && <p className="text-xs text-slate-600 leading-relaxed mt-1">{emp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">{edu.degree || "Degree"}</h3>
                  <p className="text-xs text-slate-600">{edu.institution || "Institution"}</p>
                </div>
                <span className="text-xs text-slate-500">
                  {edu.startDate || "Start"} — {edu.endDate || "End"}
                </span>
              </div>
              {edu.description && <p className="text-xs text-slate-600 leading-relaxed mt-1">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">
            Skills
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <span key={skill} className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {languages.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">
            Languages
          </h2>
          <div className="flex flex-wrap gap-4">
            {languages.map((language) => (
              <span key={language} className="text-xs text-slate-700">
                • {language}
              </span>
            ))}
          </div>
        </div>
      )}

      {!isPremium && (
        <div className="mt-8 pt-4 text-center">
          <span className="text-xs text-slate-400 tracking-wide">Created with ClearVide</span>
        </div>
      )}
    </div>
  )
}

// Modern Template - Sidebar layout with accent color
function ModernTemplate({
  personalDetails,
  summary,
  employment,
  education,
  skills,
  languages,
  hasContactInfo,
  isPremium,
}: TemplateProps) {
  return (
    <div className="min-h-full flex" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Sidebar */}
      <div className="w-1/3 bg-teal-700 text-white p-6">
        {personalDetails.photo && (
          <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-teal-500/50 flex-shrink-0 mx-auto">
            <img src={personalDetails.photo} alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-xl font-bold mb-4 leading-tight text-center">{personalDetails.fullName || "Your Name"}</h1>

        {hasContactInfo && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-2 text-teal-200">Contact</h2>
            <div className="space-y-1.5 text-xs text-teal-50">
              {personalDetails.email && <p>{personalDetails.email}</p>}
              {personalDetails.phone && <p>{personalDetails.phone}</p>}
              {personalDetails.location && <p>{personalDetails.location}</p>}
              {personalDetails.linkedIn && <p>{personalDetails.linkedIn}</p>}
              {personalDetails.website && <p>{personalDetails.website}</p>}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-2 text-teal-200">Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span key={skill} className="bg-teal-600 text-teal-50 text-xs px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {languages.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-2 text-teal-200">Languages</h2>
            <div className="space-y-1">
              {languages.map((language) => (
                <p key={language} className="text-xs text-teal-50">
                  {language}
                </p>
              ))}
            </div>
          </div>
        )}

        {!isPremium && (
          <div className="mt-auto pt-6">
            <span className="text-xs text-teal-300 tracking-wide">Created with ClearVide</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {summary && (
          <div className="mb-5">
            <h2 className="text-sm font-bold text-teal-700 mb-2">About Me</h2>
            <p className="text-xs text-slate-600 leading-relaxed">{summary}</p>
          </div>
        )}

        {employment.length > 0 && (
          <div className="mb-5">
            <h2 className="text-sm font-bold text-teal-700 mb-3">Experience</h2>
            {employment.map((emp) => (
              <div key={emp.id} className="mb-4 pl-3 border-l-2 border-teal-200">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-semibold text-slate-800">{emp.jobTitle || "Job Title"}</h3>
                  <span className="text-xs text-slate-500">
                    {emp.startDate || "Start"} — {emp.current ? "Present" : emp.endDate || "End"}
                  </span>
                </div>
                <p className="text-xs text-teal-600 font-medium mb-1">{emp.company || "Company"}</p>
                {emp.description && <p className="text-xs text-slate-600 leading-relaxed">{emp.description}</p>}
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div className="mb-5">
            <h2 className="text-sm font-bold text-teal-700 mb-3">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3 pl-3 border-l-2 border-teal-200">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-semibold text-slate-800">{edu.degree || "Degree"}</h3>
                  <span className="text-xs text-slate-500">
                    {edu.startDate || "Start"} — {edu.endDate || "End"}
                  </span>
                </div>
                <p className="text-xs text-teal-600 font-medium">{edu.institution || "Institution"}</p>
                {edu.description && <p className="text-xs text-slate-600 leading-relaxed mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Minimal Template - Simple and spacious
function MinimalTemplate({
  personalDetails,
  summary,
  employment,
  education,
  skills,
  languages,
  hasContactInfo,
  isPremium,
}: TemplateProps) {
  return (
    <div className="p-10 min-h-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="text-center mb-8">
        {personalDetails.photo && (
          <div className="w-20 h-20 mb-4 rounded-full overflow-hidden border border-slate-200 mx-auto">
            <img src={personalDetails.photo} alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-3xl font-light text-slate-900 mb-2 tracking-wide">
          {personalDetails.fullName || "Your Name"}
        </h1>
        {hasContactInfo && (
          <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-500">
            {personalDetails.email && <span>{personalDetails.email}</span>}
            {personalDetails.phone && <span>•</span>}
            {personalDetails.phone && <span>{personalDetails.phone}</span>}
            {personalDetails.location && <span>•</span>}
            {personalDetails.location && <span>{personalDetails.location}</span>}
          </div>
        )}
        {(personalDetails.linkedIn || personalDetails.website) && (
          <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-500 mt-1">
            {personalDetails.linkedIn && <span>{personalDetails.linkedIn}</span>}
            {personalDetails.website && <span>•</span>}
            {personalDetails.website && <span>{personalDetails.website}</span>}
          </div>
        )}
      </div>

      {summary && (
        <div className="mb-8 max-w-2xl mx-auto">
          <p className="text-xs text-slate-600 leading-relaxed text-center">{summary}</p>
        </div>
      )}

      {employment.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-medium text-slate-400 uppercase tracking-[0.2em] mb-4">Experience</h2>
          {employment.map((emp) => (
            <div key={emp.id} className="mb-5">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-sm font-medium text-slate-800">{emp.jobTitle || "Job Title"}</h3>
                <span className="text-xs text-slate-400">
                  {emp.startDate || "Start"} — {emp.current ? "Present" : emp.endDate || "End"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2">{emp.company || "Company"}</p>
              {emp.description && <p className="text-xs text-slate-600 leading-relaxed">{emp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-medium text-slate-400 uppercase tracking-[0.2em] mb-4">Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-sm font-medium text-slate-800">{edu.degree || "Degree"}</h3>
                <span className="text-xs text-slate-400">
                  {edu.startDate || "Start"} — {edu.endDate || "End"}
                </span>
              </div>
              <p className="text-xs text-slate-500">{edu.institution || "Institution"}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-12">
        {skills.length > 0 && (
          <div className="flex-1">
            <h2 className="text-xs font-medium text-slate-400 uppercase tracking-[0.2em] mb-3">Skills</h2>
            <p className="text-xs text-slate-600">{skills.join(" • ")}</p>
          </div>
        )}

        {languages.length > 0 && (
          <div>
            <h2 className="text-xs font-medium text-slate-400 uppercase tracking-[0.2em] mb-3">Languages</h2>
            <p className="text-xs text-slate-600">{languages.join(" • ")}</p>
          </div>
        )}
      </div>

      {!isPremium && (
        <div className="mt-10 text-center">
          <span className="text-xs text-slate-300 tracking-wide">Created with ClearVide</span>
        </div>
      )}
    </div>
  )
}

// Bold Template - Strong headers with color accents
function BoldTemplate({
  personalDetails,
  summary,
  employment,
  education,
  skills,
  languages,
  hasContactInfo,
  isPremium,
}: TemplateProps) {
  return (
    <div className="min-h-full" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-2">{personalDetails.fullName || "YOUR NAME"}</h1>
          {hasContactInfo && (
            <div className="flex flex-wrap gap-4 text-xs text-slate-300">
              {personalDetails.email && <span>{personalDetails.email}</span>}
              {personalDetails.phone && <span>{personalDetails.phone}</span>}
              {personalDetails.location && <span>{personalDetails.location}</span>}
              {personalDetails.linkedIn && <span>{personalDetails.linkedIn}</span>}
              {personalDetails.website && <span>{personalDetails.website}</span>}
            </div>
          )}
        </div>
        {personalDetails.photo && (
          <div className="w-20 h-20 ml-4 rounded-lg overflow-hidden border-2 border-amber-500 flex-shrink-0">
            <img src={personalDetails.photo} alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="p-6">
        {summary && (
          <div className="mb-6">
            <h2 className="text-sm font-black text-slate-900 uppercase mb-2 flex items-center gap-2">
              <span className="w-8 h-1 bg-amber-500"></span>
              Profile
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">{summary}</p>
          </div>
        )}

        {employment.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-black text-slate-900 uppercase mb-3 flex items-center gap-2">
              <span className="w-8 h-1 bg-amber-500"></span>
              Experience
            </h2>
            {employment.map((emp) => (
              <div key={emp.id} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{emp.jobTitle || "Job Title"}</h3>
                    <p className="text-xs text-amber-600 font-semibold">{emp.company || "Company"}</p>
                  </div>
                  <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                    {emp.startDate || "Start"} — {emp.current ? "Present" : emp.endDate || "End"}
                  </span>
                </div>
                {emp.description && <p className="text-xs text-slate-600 leading-relaxed mt-2">{emp.description}</p>}
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-black text-slate-900 uppercase mb-3 flex items-center gap-2">
              <span className="w-8 h-1 bg-amber-500"></span>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{edu.degree || "Degree"}</h3>
                    <p className="text-xs text-amber-600 font-semibold">{edu.institution || "Institution"}</p>
                  </div>
                  <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                    {edu.startDate || "Start"} — {edu.endDate || "End"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-8">
          {skills.length > 0 && (
            <div className="flex-1">
              <h2 className="text-sm font-black text-slate-900 uppercase mb-3 flex items-center gap-2">
                <span className="w-8 h-1 bg-amber-500"></span>
                Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span key={skill} className="bg-slate-900 text-white text-xs px-2 py-1 rounded font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase mb-3 flex items-center gap-2">
                <span className="w-8 h-1 bg-amber-500"></span>
                Languages
              </h2>
              <div className="space-y-1">
                {languages.map((language) => (
                  <p key={language} className="text-xs text-slate-700 font-medium">
                    {language}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {!isPremium && (
          <div className="mt-8 text-center">
            <span className="text-xs text-slate-400 tracking-wide">Created with ClearVide</span>
          </div>
        )}
      </div>
    </div>
  )
}
