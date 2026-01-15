"use server"

import { generateText } from "ai"

export async function generateSummary(fullName: string, jobTitles: string[], skills: string[]) {
  const { text } = await generateText({
    model: "openai/gpt-4o-mini",
    prompt: `Write a professional resume summary (2-3 sentences, max 50 words) for ${fullName || "a professional"}. 
${jobTitles.length > 0 ? `Recent job titles: ${jobTitles.join(", ")}.` : ""}
${skills.length > 0 ? `Key skills: ${skills.join(", ")}.` : ""}
Write in first person, be concise and impactful. Focus on value proposition.`,
    maxOutputTokens: 150,
  })

  return text
}

export async function generateJobDescription(jobTitle: string, company: string) {
  const { text } = await generateText({
    model: "openai/gpt-4o-mini",
    prompt: `Write 3-4 bullet points (as a single paragraph with bullet points separated by newlines) for a ${jobTitle} position at ${company || "a company"}. 
Each bullet should start with a strong action verb and include a quantifiable achievement where possible.
Keep it concise - each bullet should be one line.
Format: Start each line with "• "`,
    maxOutputTokens: 250,
  })

  return text
}

export async function suggestSkills(jobTitles: string[], existingSkills: string[]) {
  const { text } = await generateText({
    model: "openai/gpt-4o-mini",
    prompt: `Suggest 5-8 relevant technical and soft skills for someone with these job titles: ${jobTitles.join(", ")}.
${existingSkills.length > 0 ? `They already have: ${existingSkills.join(", ")}. Suggest different ones.` : ""}
Return ONLY a comma-separated list of skills, nothing else. Example: JavaScript, React, Project Management, Communication`,
    maxOutputTokens: 100,
  })

  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}
