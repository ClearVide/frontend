import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer"
import type { ResumeData, ResumeTemplate } from "@/lib/resume-context"

// Use standard PDF fonts for maximum reliability
const standardFont = "Helvetica"
const boldFont = "Helvetica-Bold"


interface ResumeDocumentProps {
  data: ResumeData
  isPremium: boolean
  template: ResumeTemplate
}

export function ResumeDocument({ data, isPremium, template }: ResumeDocumentProps) {
  switch (template) {
    case "modern":
      return <ModernPDF data={data} isPremium={isPremium} />
    case "minimal":
      return <MinimalPDF data={data} isPremium={isPremium} />
    case "bold":
      return <BoldPDF data={data} isPremium={isPremium} />
    default:
      return <ClassicPDF data={data} isPremium={isPremium} />
  }
}

// Classic PDF Template
const classicStyles = StyleSheet.create({
  page: {
    fontFamily: standardFont,
    fontSize: 10,
    padding: 40,
    backgroundColor: "#ffffff",
    position: "relative",
  },
  watermark: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 9,
    color: "#94a3b8",
    letterSpacing: 0.5,
  },
  header: {
    marginBottom: 20,
    borderBottom: "2px solid #1e293b",
    paddingBottom: 15,
  },
  name: {
    fontSize: 24,
    fontFamily: boldFont,
    color: "#0f172a",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 4,
  },
  contactItem: {
    fontSize: 9,
    color: "#475569",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: boldFont,
    color: "#1e293b",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: 4,
  },
  summary: {
    fontSize: 10,
    color: "#334155",
    lineHeight: 1.5,
  },
  entryContainer: {
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  entryTitle: {
    fontSize: 11,
    fontFamily: boldFont,
    color: "#1e293b",
  },
  entrySubtitle: {
    fontSize: 10,
    color: "#475569",
    marginTop: 1,
  },
  entryDate: {
    fontSize: 9,
    color: "#64748b",
  },
  entryDescription: {
    fontSize: 9,
    color: "#475569",
    lineHeight: 1.5,
    marginTop: 4,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillTag: {
    backgroundColor: "#f1f5f9",
    color: "#334155",
    fontSize: 9,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  languagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  languageItem: {
    fontSize: 10,
    color: "#334155",
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 4,
    objectFit: "cover",
  },
})

function ClassicPDF({ data, isPremium }: { data: ResumeData; isPremium: boolean }) {
  const { personalDetails, summary, employment, education, skills, languages } = data
  const hasContactInfo =
    personalDetails.email ||
    personalDetails.phone ||
    personalDetails.location ||
    personalDetails.linkedIn ||
    personalDetails.website

  return (
    <Document>
      <Page size="A4" style={classicStyles.page}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", ...classicStyles.header }}>
          <View style={{ flex: 1 }}>
            <Text style={classicStyles.name}>{personalDetails.fullName || "Your Name"}</Text>
            {hasContactInfo && (
              <View style={classicStyles.contactRow}>
                {personalDetails.email && <Text style={classicStyles.contactItem}>{personalDetails.email}</Text>}
                {personalDetails.phone && <Text style={classicStyles.contactItem}>{personalDetails.phone}</Text>}
                {personalDetails.location && <Text style={classicStyles.contactItem}>{personalDetails.location}</Text>}
                {personalDetails.linkedIn && <Text style={classicStyles.contactItem}>{personalDetails.linkedIn}</Text>}
                {personalDetails.website && <Text style={classicStyles.contactItem}>{personalDetails.website}</Text>}
              </View>
            )}
          </View>
          {personalDetails.photo && (
            <View style={{ marginLeft: 20 }}>
              <Image src={personalDetails.photo} style={classicStyles.photo} />
            </View>
          )}
        </View>

        {summary && (
          <View style={classicStyles.section}>
            <Text style={classicStyles.sectionTitle}>Professional Summary</Text>
            <Text style={classicStyles.summary}>{summary}</Text>
          </View>
        )}

        {employment.length > 0 && (
          <View style={classicStyles.section}>
            <Text style={classicStyles.sectionTitle}>Employment History</Text>
            {employment.map((emp) => (
              <View key={emp.id} style={classicStyles.entryContainer}>
                <View style={classicStyles.entryHeader}>
                  <View>
                    <Text style={classicStyles.entryTitle}>{emp.jobTitle || "Job Title"}</Text>
                    <Text style={classicStyles.entrySubtitle}>{emp.company || "Company"}</Text>
                  </View>
                  <Text style={classicStyles.entryDate}>
                    {emp.startDate || "Start"} — {emp.current ? "Present" : emp.endDate || "End"}
                  </Text>
                </View>
                {emp.description && <Text style={classicStyles.entryDescription}>{emp.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View style={classicStyles.section}>
            <Text style={classicStyles.sectionTitle}>Education</Text>
            {education.map((edu) => (
              <View key={edu.id} style={classicStyles.entryContainer}>
                <View style={classicStyles.entryHeader}>
                  <View>
                    <Text style={classicStyles.entryTitle}>{edu.degree || "Degree"}</Text>
                    <Text style={classicStyles.entrySubtitle}>{edu.institution || "Institution"}</Text>
                  </View>
                  <Text style={classicStyles.entryDate}>
                    {edu.startDate || "Start"} — {edu.endDate || "End"}
                  </Text>
                </View>
                {edu.description && <Text style={classicStyles.entryDescription}>{edu.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {skills.length > 0 && (
          <View style={classicStyles.section}>
            <Text style={classicStyles.sectionTitle}>Skills</Text>
            <View style={classicStyles.skillsContainer}>
              {skills.map((skill) => (
                <Text key={skill} style={classicStyles.skillTag}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}

        {languages.length > 0 && (
          <View style={classicStyles.section}>
            <Text style={classicStyles.sectionTitle}>Languages</Text>
            <View style={classicStyles.languagesContainer}>
              {languages.map((language) => (
                <Text key={language} style={classicStyles.languageItem}>
                  • {language}
                </Text>
              ))}
            </View>
          </View>
        )}

        {!isPremium && <Text style={classicStyles.watermark}>Created with ClearVide</Text>}
      </Page>
    </Document>
  )
}

// Modern PDF Template (sidebar layout)
const modernStyles = StyleSheet.create({
  page: {
    fontFamily: standardFont,
    fontSize: 10,
    flexDirection: "row",
    backgroundColor: "#ffffff",
  },
  sidebar: {
    width: "35%",
    backgroundColor: "#0f766e",
    padding: 25,
    color: "#ffffff",
  },
  main: {
    flex: 1,
    padding: 25,
  },
  name: {
    fontSize: 18,
    fontFamily: boldFont,
    color: "#ffffff",
    marginBottom: 15,
  },
  sidebarSection: {
    marginBottom: 20,
  },
  sidebarTitle: {
    fontSize: 9,
    fontFamily: boldFont,
    color: "#5eead4",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  contactItem: {
    fontSize: 8,
    color: "#ccfbf1",
    marginBottom: 4,
  },
  skillTag: {
    backgroundColor: "#0d9488",
    color: "#ccfbf1",
    fontSize: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
    marginRight: 4,
    marginBottom: 4,
  },
  mainSection: {
    marginBottom: 18,
  },
  mainTitle: {
    fontSize: 12,
    fontFamily: boldFont,
    color: "#0f766e",
    marginBottom: 10,
  },
  summary: {
    fontSize: 9,
    color: "#475569",
    lineHeight: 1.5,
  },
  entryContainer: {
    marginBottom: 12,
    paddingLeft: 10,
    borderLeft: "2px solid #99f6e4",
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  entryTitle: {
    fontSize: 10,
    fontFamily: boldFont,
    color: "#1e293b",
  },
  entryCompany: {
    fontSize: 9,
    color: "#0f766e",
    fontFamily: boldFont,
    marginBottom: 3,
  },
  entryDate: {
    fontSize: 8,
    color: "#64748b",
  },
  entryDescription: {
    fontSize: 8,
    color: "#475569",
    lineHeight: 1.5,
  },
  watermark: {
    fontSize: 8,
    color: "#5eead4",
    marginTop: "auto",
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    border: "2px solid #5eead4",
    marginBottom: 15,
    objectFit: "cover",
    alignSelf: "center",
  },
})

function ModernPDF({ data, isPremium }: { data: ResumeData; isPremium: boolean }) {
  const { personalDetails, summary, employment, education, skills, languages } = data
  const hasContactInfo =
    personalDetails.email ||
    personalDetails.phone ||
    personalDetails.location ||
    personalDetails.linkedIn ||
    personalDetails.website

  return (
    <Document>
      <Page size="A4" style={modernStyles.page}>
        <View style={modernStyles.sidebar}>
          {personalDetails.photo && <Image src={personalDetails.photo} style={modernStyles.photo} />}
          <Text style={{ ...modernStyles.name, textAlign: "center" }}>{personalDetails.fullName || "Your Name"}</Text>

          {hasContactInfo && (
            <View style={modernStyles.sidebarSection}>
              <Text style={modernStyles.sidebarTitle}>Contact</Text>
              {personalDetails.email && <Text style={modernStyles.contactItem}>{personalDetails.email}</Text>}
              {personalDetails.phone && <Text style={modernStyles.contactItem}>{personalDetails.phone}</Text>}
              {personalDetails.location && <Text style={modernStyles.contactItem}>{personalDetails.location}</Text>}
              {personalDetails.linkedIn && <Text style={modernStyles.contactItem}>{personalDetails.linkedIn}</Text>}
              {personalDetails.website && <Text style={modernStyles.contactItem}>{personalDetails.website}</Text>}
            </View>
          )}

          {skills.length > 0 && (
            <View style={modernStyles.sidebarSection}>
              <Text style={modernStyles.sidebarTitle}>Skills</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {skills.map((skill) => (
                  <Text key={skill} style={modernStyles.skillTag}>
                    {skill}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {languages.length > 0 && (
            <View style={modernStyles.sidebarSection}>
              <Text style={modernStyles.sidebarTitle}>Languages</Text>
              {languages.map((language) => (
                <Text key={language} style={modernStyles.contactItem}>
                  {language}
                </Text>
              ))}
            </View>
          )}

          {!isPremium && <Text style={modernStyles.watermark}>Created with ClearVide</Text>}
        </View>

        <View style={modernStyles.main}>
          {summary && (
            <View style={modernStyles.mainSection}>
              <Text style={modernStyles.mainTitle}>About Me</Text>
              <Text style={modernStyles.summary}>{summary}</Text>
            </View>
          )}

          {employment.length > 0 && (
            <View style={modernStyles.mainSection}>
              <Text style={modernStyles.mainTitle}>Experience</Text>
              {employment.map((emp) => (
                <View key={emp.id} style={modernStyles.entryContainer}>
                  <View style={modernStyles.entryHeader}>
                    <Text style={modernStyles.entryTitle}>{emp.jobTitle || "Job Title"}</Text>
                    <Text style={modernStyles.entryDate}>
                      {emp.startDate || "Start"} — {emp.current ? "Present" : emp.endDate || "End"}
                    </Text>
                  </View>
                  <Text style={modernStyles.entryCompany}>{emp.company || "Company"}</Text>
                  {emp.description && <Text style={modernStyles.entryDescription}>{emp.description}</Text>}
                </View>
              ))}
            </View>
          )}

          {education.length > 0 && (
            <View style={modernStyles.mainSection}>
              <Text style={modernStyles.mainTitle}>Education</Text>
              {education.map((edu) => (
                <View key={edu.id} style={modernStyles.entryContainer}>
                  <View style={modernStyles.entryHeader}>
                    <Text style={modernStyles.entryTitle}>{edu.degree || "Degree"}</Text>
                    <Text style={modernStyles.entryDate}>
                      {edu.startDate || "Start"} — {edu.endDate || "End"}
                    </Text>
                  </View>
                  <Text style={modernStyles.entryCompany}>{edu.institution || "Institution"}</Text>
                  {edu.description && <Text style={modernStyles.entryDescription}>{edu.description}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  )
}

// Minimal PDF Template
const minimalStyles = StyleSheet.create({
  page: {
    fontFamily: standardFont,
    fontSize: 10,
    padding: 50,
    backgroundColor: "#ffffff",
  },
  header: {
    textAlign: "center",
    marginBottom: 30,
  },
  name: {
    fontSize: 28,
    fontFamily: standardFont,
    color: "#0f172a",
    marginBottom: 8,
    letterSpacing: 1,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  contactItem: {
    fontSize: 9,
    color: "#64748b",
  },
  contactDot: {
    fontSize: 9,
    color: "#64748b",
  },
  summary: {
    fontSize: 9,
    color: "#475569",
    lineHeight: 1.6,
    textAlign: "center",
    maxWidth: 400,
    marginHorizontal: "auto",
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: boldFont,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 12,
  },
  entryContainer: {
    marginBottom: 15,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  entryTitle: {
    fontSize: 11,
    fontFamily: boldFont,
    color: "#1e293b",
  },
  entrySubtitle: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 4,
  },
  entryDate: {
    fontSize: 9,
    color: "#94a3b8",
  },
  entryDescription: {
    fontSize: 9,
    color: "#475569",
    lineHeight: 1.5,
  },
  bottomRow: {
    flexDirection: "row",
    gap: 40,
  },
  bottomSection: {
    flex: 1,
  },
  skillsText: {
    fontSize: 9,
    color: "#475569",
  },
  watermark: {
    textAlign: "center",
    fontSize: 8,
    color: "#cbd5e1",
    marginTop: 30,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
    objectFit: "cover",
    alignSelf: "center",
  },
})

function MinimalPDF({ data, isPremium }: { data: ResumeData; isPremium: boolean }) {
  const { personalDetails, summary, employment, education, skills, languages } = data
  const hasContactInfo = personalDetails.email || personalDetails.phone || personalDetails.location

  return (
    <Document>
      <Page size="A4" style={minimalStyles.page}>
        <View style={minimalStyles.header}>
          {personalDetails.photo && <Image src={personalDetails.photo} style={minimalStyles.photo} />}
          <Text style={minimalStyles.name}>{personalDetails.fullName || "Your Name"}</Text>
          {hasContactInfo && (
            <View style={minimalStyles.contactRow}>
              {personalDetails.email && <Text style={minimalStyles.contactItem}>{personalDetails.email}</Text>}
              {personalDetails.phone && <Text style={minimalStyles.contactDot}>•</Text>}
              {personalDetails.phone && <Text style={minimalStyles.contactItem}>{personalDetails.phone}</Text>}
              {personalDetails.location && <Text style={minimalStyles.contactDot}>•</Text>}
              {personalDetails.location && <Text style={minimalStyles.contactItem}>{personalDetails.location}</Text>}
            </View>
          )}
        </View>

        {summary && <Text style={minimalStyles.summary}>{summary}</Text>}

        {employment.length > 0 && (
          <View style={minimalStyles.section}>
            <Text style={minimalStyles.sectionTitle}>Experience</Text>
            {employment.map((emp) => (
              <View key={emp.id} style={minimalStyles.entryContainer}>
                <View style={minimalStyles.entryHeader}>
                  <Text style={minimalStyles.entryTitle}>{emp.jobTitle || "Job Title"}</Text>
                  <Text style={minimalStyles.entryDate}>
                    {emp.startDate || "Start"} — {emp.current ? "Present" : emp.endDate || "End"}
                  </Text>
                </View>
                <Text style={minimalStyles.entrySubtitle}>{emp.company || "Company"}</Text>
                {emp.description && <Text style={minimalStyles.entryDescription}>{emp.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View style={minimalStyles.section}>
            <Text style={minimalStyles.sectionTitle}>Education</Text>
            {education.map((edu) => (
              <View key={edu.id} style={minimalStyles.entryContainer}>
                <View style={minimalStyles.entryHeader}>
                  <Text style={minimalStyles.entryTitle}>{edu.degree || "Degree"}</Text>
                  <Text style={minimalStyles.entryDate}>
                    {edu.startDate || "Start"} — {edu.endDate || "End"}
                  </Text>
                </View>
                <Text style={minimalStyles.entrySubtitle}>{edu.institution || "Institution"}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={minimalStyles.bottomRow}>
          {skills.length > 0 && (
            <View style={minimalStyles.bottomSection}>
              <Text style={minimalStyles.sectionTitle}>Skills</Text>
              <Text style={minimalStyles.skillsText}>{skills.join(" • ")}</Text>
            </View>
          )}
          {languages.length > 0 && (
            <View>
              <Text style={minimalStyles.sectionTitle}>Languages</Text>
              <Text style={minimalStyles.skillsText}>{languages.join(" • ")}</Text>
            </View>
          )}
        </View>

        {!isPremium && <Text style={minimalStyles.watermark}>Created with ClearVide</Text>}
      </Page>
    </Document>
  )
}

// Bold PDF Template
const boldStyles = StyleSheet.create({
  page: {
    fontFamily: standardFont,
    fontSize: 10,
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "#0f172a",
    padding: 25,
    color: "#ffffff",
  },
  name: {
    fontSize: 22,
    fontFamily: boldFont,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  contactItem: {
    fontSize: 9,
    color: "#cbd5e1",
  },
  main: {
    padding: 25,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: boldFont,
    color: "#0f172a",
    textTransform: "uppercase",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  accentBar: {
    width: 30,
    height: 4,
    backgroundColor: "#f59e0b",
    marginRight: 8,
  },
  summary: {
    fontSize: 9,
    color: "#475569",
    lineHeight: 1.5,
  },
  entryContainer: {
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  entryTitle: {
    fontSize: 11,
    fontFamily: boldFont,
    color: "#0f172a",
  },
  entryCompany: {
    fontSize: 9,
    color: "#d97706",
    fontFamily: boldFont,
    marginBottom: 4,
  },
  entryDate: {
    fontSize: 8,
    color: "#64748b",
    fontFamily: boldFont,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  entryDescription: {
    fontSize: 9,
    color: "#475569",
    lineHeight: 1.5,
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: "row",
    gap: 30,
  },
  bottomSection: {
    flex: 1,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  skillTag: {
    backgroundColor: "#0f172a",
    color: "#ffffff",
    fontSize: 8,
    fontFamily: boldFont,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
  },
  languageItem: {
    fontSize: 9,
    color: "#334155",
    fontFamily: boldFont,
    marginBottom: 3,
  },
  watermark: {
    textAlign: "center",
    fontSize: 8,
    color: "#94a3b8",
    marginTop: 20,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    border: "2px solid #f59e0b",
    objectFit: "cover",
  },
})

function BoldPDF({ data, isPremium }: { data: ResumeData; isPremium: boolean }) {
  const { personalDetails, summary, employment, education, skills, languages } = data
  const hasContactInfo =
    personalDetails.email ||
    personalDetails.phone ||
    personalDetails.location ||
    personalDetails.linkedIn ||
    personalDetails.website

  return (
    <Document>
      <Page size="A4" style={boldStyles.page}>
        <View style={{ ...boldStyles.header, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={boldStyles.name}>{personalDetails.fullName || "YOUR NAME"}</Text>
            {hasContactInfo && (
              <View style={boldStyles.contactRow}>
                {personalDetails.email && <Text style={boldStyles.contactItem}>{personalDetails.email}</Text>}
                {personalDetails.phone && <Text style={boldStyles.contactItem}>{personalDetails.phone}</Text>}
                {personalDetails.location && <Text style={boldStyles.contactItem}>{personalDetails.location}</Text>}
                {personalDetails.linkedIn && <Text style={boldStyles.contactItem}>{personalDetails.linkedIn}</Text>}
                {personalDetails.website && <Text style={boldStyles.contactItem}>{personalDetails.website}</Text>}
              </View>
            )}
          </View>
          {personalDetails.photo && <Image src={personalDetails.photo} style={boldStyles.photo} />}
        </View>

        <View style={boldStyles.main}>
          {summary && (
            <View style={boldStyles.section}>
              <View style={boldStyles.sectionTitle}>
                <View style={boldStyles.accentBar} />
                <Text>Profile</Text>
              </View>
              <Text style={boldStyles.summary}>{summary}</Text>
            </View>
          )}

          {employment.length > 0 && (
            <View style={boldStyles.section}>
              <View style={boldStyles.sectionTitle}>
                <View style={boldStyles.accentBar} />
                <Text>Experience</Text>
              </View>
              {employment.map((emp) => (
                <View key={emp.id} style={boldStyles.entryContainer}>
                  <View style={boldStyles.entryHeader}>
                    <View>
                      <Text style={boldStyles.entryTitle}>{emp.jobTitle || "Job Title"}</Text>
                      <Text style={boldStyles.entryCompany}>{emp.company || "Company"}</Text>
                    </View>
                    <Text style={boldStyles.entryDate}>
                      {emp.startDate || "Start"} — {emp.current ? "Present" : emp.endDate || "End"}
                    </Text>
                  </View>
                  {emp.description && <Text style={boldStyles.entryDescription}>{emp.description}</Text>}
                </View>
              ))}
            </View>
          )}

          {education.length > 0 && (
            <View style={boldStyles.section}>
              <View style={boldStyles.sectionTitle}>
                <View style={boldStyles.accentBar} />
                <Text>Education</Text>
              </View>
              {education.map((edu) => (
                <View key={edu.id} style={boldStyles.entryContainer}>
                  <View style={boldStyles.entryHeader}>
                    <View>
                      <Text style={boldStyles.entryTitle}>{edu.degree || "Degree"}</Text>
                      <Text style={boldStyles.entryCompany}>{edu.institution || "Institution"}</Text>
                    </View>
                    <Text style={boldStyles.entryDate}>
                      {edu.startDate || "Start"} — {edu.endDate || "End"}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={boldStyles.bottomRow}>
            {skills.length > 0 && (
              <View style={boldStyles.bottomSection}>
                <View style={boldStyles.sectionTitle}>
                  <View style={boldStyles.accentBar} />
                  <Text>Skills</Text>
                </View>
                <View style={boldStyles.skillsContainer}>
                  {skills.map((skill) => (
                    <Text key={skill} style={boldStyles.skillTag}>
                      {skill}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {languages.length > 0 && (
              <View>
                <View style={boldStyles.sectionTitle}>
                  <View style={boldStyles.accentBar} />
                  <Text>Languages</Text>
                </View>
                {languages.map((language) => (
                  <Text key={language} style={boldStyles.languageItem}>
                    {language}
                  </Text>
                ))}
              </View>
            )}
          </View>

          {!isPremium && <Text style={boldStyles.watermark}>Created with ClearVide</Text>}
        </View>
      </Page>
    </Document>
  )
}
