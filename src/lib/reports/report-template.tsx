import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { ReportData } from "@/lib/reports/report-types";

const COLORS = {
  primary: "#2563EB",
  text: "#111827",
  muted: "#6B7280",
  border: "#E5E7EB",
  success: "#16A34A",
  warning: "#F59E0B",
  bg: "#F8FAFC",
};

const styles = StyleSheet.create({
  page: { paddingTop: 50, paddingBottom: 60, paddingHorizontal: 40, fontSize: 10, color: COLORS.text, fontFamily: "Helvetica" },
  header: { position: "absolute", top: 20, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottom: `1pt solid ${COLORS.border}`, paddingBottom: 8 },
  headerBrand: { fontSize: 10, fontWeight: 700, color: COLORS.primary },
  headerSection: { fontSize: 9, color: COLORS.muted },
  footer: { position: "absolute", bottom: 20, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", borderTop: `1pt solid ${COLORS.border}`, paddingTop: 8 },
  footerText: { fontSize: 8, color: COLORS.muted },
  h1: { fontSize: 20, fontWeight: 700, color: COLORS.text, marginBottom: 6 },
  h2: { fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 10, marginTop: 4 },
  h3: { fontSize: 11, fontWeight: 700, color: COLORS.text, marginBottom: 4 },
  body: { fontSize: 10, color: COLORS.text, lineHeight: 1.5 },
  muted: { fontSize: 9, color: COLORS.muted },
  card: { border: `1pt solid ${COLORS.border}`, borderRadius: 6, padding: 12, marginBottom: 10, backgroundColor: "#FFFFFF" },
  row: { flexDirection: "row" },
  badge: { fontSize: 8, fontWeight: 700, color: "#FFFFFF", backgroundColor: COLORS.primary, borderRadius: 4, paddingVertical: 3, paddingHorizontal: 6, alignSelf: "flex-start" },
  progressTrack: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, marginTop: 3, marginBottom: 3 },
  progressFill: { height: 6, backgroundColor: COLORS.primary, borderRadius: 3 },
  tableHeaderRow: { flexDirection: "row", backgroundColor: COLORS.bg, paddingVertical: 6, paddingHorizontal: 6, borderBottom: `1pt solid ${COLORS.border}` },
  tableRow: { flexDirection: "row", paddingVertical: 6, paddingHorizontal: 6, borderBottom: `1pt solid ${COLORS.border}` },
  tableCellHeader: { fontSize: 8, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase" },
  tableCell: { fontSize: 9, color: COLORS.text },
  bullet: { flexDirection: "row", marginBottom: 3 },
  bulletDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: COLORS.text, marginTop: 4, marginRight: 6 },
});

function ProgressBar({ percent, color = COLORS.primary }: { percent: number; color?: string }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: color }]} />
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bullet}>
      <View style={styles.bulletDot} />
      <Text style={[styles.body, { flex: 1 }]}>{text}</Text>
    </View>
  );
}

function PageChrome({ section }: { section: string }) {
  return (
    <>
      <View style={styles.header} fixed>
        <Text style={styles.headerBrand}>FuturePath AI</Text>
        <Text style={styles.headerSection}>{section}</Text>
      </View>
      <View style={styles.footer} fixed>
        <Text style={styles.footerText}>Confidential — for family use only</Text>
        <Text
          style={styles.footerText}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        />
      </View>
    </>
  );
}

interface ReportDocumentProps {
  data: ReportData;
}

export function ReportDocument({ data }: ReportDocumentProps) {
  const formattedDate = data.generatedAt.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Document title={`${data.child.firstName}'s Career Report`} author="FuturePath AI">
      {/* ---- Cover Page ---- */}
      <Page size="A4" style={[styles.page, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ fontSize: 12, fontWeight: 700, color: COLORS.primary, marginBottom: 40 }}>
          FuturePath AI
        </Text>
        <Text style={{ fontSize: 26, fontWeight: 700, color: COLORS.text, textAlign: "center", marginBottom: 10 }}>
          Career Discovery Report
        </Text>
        <Text style={{ fontSize: 14, color: COLORS.muted, marginBottom: 40 }}>
          {data.child.firstName} {data.child.lastName}, age {data.child.age}
        </Text>

        <View style={{ width: "70%", border: `1pt solid ${COLORS.border}`, borderRadius: 8, padding: 20 }}>
          <View style={[styles.row, { justifyContent: "space-between", marginBottom: 14 }]}>
            <Text style={styles.muted}>Top Career Match</Text>
            <Text style={{ fontSize: 11, fontWeight: 700, color: COLORS.primary }}>{data.topCareerMatch}</Text>
          </View>
          <View style={[styles.row, { justifyContent: "space-between" }]}>
            <Text style={styles.muted}>AI Confidence</Text>
            <Text style={{ fontSize: 11, fontWeight: 700 }}>{data.confidenceScore}%</Text>
          </View>
        </View>

        <Text style={{ fontSize: 9, color: COLORS.muted, marginTop: 50 }}>Generated {formattedDate}</Text>
      </Page>

      {/* ---- Assessment Summary + AI Analysis ---- */}
      <Page size="A4" style={styles.page}>
        <PageChrome section="Assessment & AI Analysis" />

        <Text style={styles.h2}>Assessment Summary</Text>
        <View style={styles.card}>
          {data.assessment.completedSections.map((s) => (
            <View key={s.sectionTitle} style={{ marginBottom: 8 }}>
              <View style={[styles.row, { justifyContent: "space-between" }]}>
                <Text style={[styles.body, { fontWeight: 700 }]}>{s.sectionTitle}</Text>
                <Text style={styles.muted}>{s.answered}/{s.total}</Text>
              </View>
              <ProgressBar percent={s.total === 0 ? 0 : Math.round((s.answered / s.total) * 100)} />
            </View>
          ))}
        </View>

        {data.assessment.keyResponses.length > 0 && (
          <>
            <Text style={styles.h3}>Key Responses</Text>
            <View style={styles.card}>
              {data.assessment.keyResponses.map((r) => (
                <View key={r.question} style={{ marginBottom: 8 }}>
                  <Text style={[styles.body, { fontWeight: 700 }]}>{r.question}</Text>
                  <Text style={styles.muted}>{r.answer}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={styles.h2}>AI Analysis</Text>
        <View style={styles.card}>
          <Text style={styles.body}>{data.aiAnalysis.careerInterestAnalysis ? data.assessment.overallSummary : ""}</Text>
        </View>

        <View style={[styles.row, { gap: 10 }]}>
          <View style={[styles.card, { flex: 1 }]}>
            <Text style={styles.h3}>Strengths</Text>
            {data.aiAnalysis.strengths.map((s) => (
              <Bullet key={s} text={s} />
            ))}
          </View>
          <View style={[styles.card, { flex: 1 }]}>
            <Text style={styles.h3}>Areas for Growth</Text>
            {data.aiAnalysis.weaknesses.map((w) => (
              <Bullet key={w} text={w} />
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.h3}>Learning Style</Text>
          <Text style={styles.body}>{data.aiAnalysis.learningStyleAnalysis}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.h3}>Personality</Text>
          <Text style={styles.body}>{data.aiAnalysis.personalityAnalysis}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.h3}>Career Interests</Text>
          <Text style={styles.body}>{data.aiAnalysis.careerInterestAnalysis}</Text>
          <View style={{ marginTop: 6 }}>
            <Text style={styles.muted}>Confidence Score: {data.aiAnalysis.confidenceScore}%</Text>
            <ProgressBar percent={data.aiAnalysis.confidenceScore} />
          </View>
        </View>
      </Page>

      {/* ---- Career Recommendations ---- */}
      <Page size="A4" style={styles.page}>
        <PageChrome section="Career Recommendations" />
        <Text style={styles.h1}>Top Career Recommendations</Text>

        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableCellHeader, { width: "26%" }]}>Career</Text>
          <Text style={[styles.tableCellHeader, { width: "12%" }]}>Match</Text>
          <Text style={[styles.tableCellHeader, { width: "18%" }]}>Salary</Text>
          <Text style={[styles.tableCellHeader, { width: "14%" }]}>Demand</Text>
          <Text style={[styles.tableCellHeader, { width: "30%" }]}>Education</Text>
        </View>
        {data.topRecommendations.map((r) => (
          <View key={r.careerTitle} style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "26%", fontWeight: r.isSelected ? 700 : 400 }]}>
              {r.careerTitle}{r.isSelected ? " (Selected)" : ""}
            </Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>{r.matchScore}%</Text>
            <Text style={[styles.tableCell, { width: "18%" }]}>{r.salaryRange}</Text>
            <Text style={[styles.tableCell, { width: "14%" }]}>{r.futureDemand}</Text>
            <Text style={[styles.tableCell, { width: "30%" }]}>{r.educationLevel}</Text>
          </View>
        ))}

        <View style={{ marginTop: 16 }}>
          {data.topRecommendations.map((r) => (
            <View key={`reason-${r.careerTitle}`} style={styles.card}>
              <Text style={[styles.h3]}>{r.careerTitle}</Text>
              <Text style={styles.body}>{r.reasoning}</Text>
            </View>
          ))}
        </View>
      </Page>

      {/* ---- Selected Career Detail ---- */}
      <Page size="A4" style={styles.page}>
        <PageChrome section={data.selectedCareer.careerTitle} />
        <Text style={styles.h1}>{data.selectedCareer.careerTitle}</Text>
        <Text style={[styles.muted, { marginBottom: 10 }]}>{data.selectedCareer.careerCategory}</Text>
        <Text style={styles.body}>{data.selectedCareer.description}</Text>

        <View style={[styles.row, { gap: 10, marginTop: 12 }]}>
          <View style={[styles.card, { flex: 1 }]}>
            <Text style={styles.h3}>Advantages</Text>
            {data.selectedCareer.advantages.map((a) => (
              <Bullet key={a} text={a} />
            ))}
          </View>
          <View style={[styles.card, { flex: 1 }]}>
            <Text style={styles.h3}>Challenges</Text>
            {data.selectedCareer.challenges.map((c) => (
              <Bullet key={c} text={c} />
            ))}
          </View>
        </View>

        {data.selectedCareer.skillGaps.length > 0 && (
          <>
            <Text style={styles.h2}>Skill Gaps</Text>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableCellHeader, { width: "40%" }]}>Skill</Text>
              <Text style={[styles.tableCellHeader, { width: "20%" }]}>Current</Text>
              <Text style={[styles.tableCellHeader, { width: "20%" }]}>Required</Text>
              <Text style={[styles.tableCellHeader, { width: "20%" }]}>Priority</Text>
            </View>
            {data.selectedCareer.skillGaps.map((g) => (
              <View key={g.skill} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: "40%" }]}>{g.skill}</Text>
                <Text style={[styles.tableCell, { width: "20%" }]}>{g.currentLevel}%</Text>
                <Text style={[styles.tableCell, { width: "20%" }]}>{g.requiredLevel}%</Text>
                <Text style={[styles.tableCell, { width: "20%" }]}>{g.priority}</Text>
              </View>
            ))}
          </>
        )}

        {data.selectedCareer.careerPath.length > 0 && (
          <>
            <Text style={styles.h2}>Career Path</Text>
            {data.selectedCareer.careerPath.map((step) => (
              <View key={step.step} style={styles.card}>
                <Text style={styles.h3}>{step.step}. {step.title}</Text>
                <Text style={styles.body}>{step.description}</Text>
              </View>
            ))}
          </>
        )}
      </Page>

      {/* ---- Learning Roadmap ---- */}
      {data.roadmap && (
        <Page size="A4" style={styles.page}>
          <PageChrome section="Learning Roadmap" />
          <Text style={styles.h1}>{data.roadmap.title}</Text>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.muted}>Overall Progress: {data.roadmap.overallProgress}%</Text>
            <ProgressBar percent={data.roadmap.overallProgress} color={COLORS.success} />
          </View>

          {data.roadmap.phases.map((phase) => (
            <View key={phase.id} style={styles.card}>
              <View style={[styles.row, { justifyContent: "space-between" }]}>
                <Text style={styles.h3}>{phase.title}</Text>
                <View style={styles.badge}>
                  <Text style={{ color: "#FFFFFF", fontSize: 8 }}>{phase.progressPercent}%</Text>
                </View>
              </View>
              <Text style={[styles.muted, { marginBottom: 4 }]}>{phase.estimatedWeeks} weeks</Text>
              <ProgressBar percent={phase.progressPercent} />
              {phase.milestones.map((m) => (
                <Text key={m.id} style={[styles.muted, { marginTop: 4 }]}>
                  {m.isCompleted ? "✓" : "○"} {m.title}
                </Text>
              ))}
            </View>
          ))}
        </Page>
      )}

      {/* ---- Next Steps ---- */}
      <Page size="A4" style={styles.page}>
        <PageChrome section="Next Steps" />
        <Text style={styles.h1}>Next Steps</Text>

        <Text style={styles.h2}>Recommendations for Parents</Text>
        <View style={styles.card}>
          {data.nextSteps.recommendationsForParents.map((r) => (
            <Bullet key={r} text={r} />
          ))}
        </View>

        <Text style={styles.h2}>Suggested Activities</Text>
        <View style={styles.card}>
          {data.nextSteps.suggestedActivities.map((a) => (
            <Bullet key={a} text={a} />
          ))}
        </View>

        <Text style={styles.h2}>Resources</Text>
        <View style={styles.card}>
          {data.nextSteps.resources.map((r) => (
            <Text key={r.title} style={styles.body}>{r.title} — {r.url}</Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}