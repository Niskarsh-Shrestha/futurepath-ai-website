"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildReportData } from "@/lib/reports/report-builder";
import { generateReportPdf } from "@/lib/reports/pdf-generator";

interface GenerateReportResult {
  success: boolean;
  reportId?: string;
  error?: string;
}

/**
 * Generates (or returns existing, cached) a CareerReport for a given
 * recommendation. Same caching pattern as every other generation action
 * in this project (AI Analysis, Career Recommendations, Learning
 * Roadmap) — never regenerates automatically if a report already exists.
 */
export async function generateReport(recommendationId: string): Promise<GenerateReportResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const existingReport = await db.careerReport.findUnique({
    where: { recommendationId },
  });
  if (existingReport) {
    return { success: true, reportId: existingReport.id };
  }

  const { data, ownerId } = await buildReportData(recommendationId);

  if (!data || ownerId !== session.user.id) {
    return { success: false, error: "Career recommendation not found" };
  }

  let pdfPath: string | null = null;
  try {
    pdfPath = await generateReportPdf(data, recommendationId);
  } catch (err) {
    console.error("[Report] PDF generation failed:", err);
    // Non-fatal — the online report can still be viewed even if the
    // PDF write failed; pdfPath stays null and the download button
    // can retry generation later (Module 3).
  }

  const title = `${data.child.firstName}'s Career Discovery Report`;
  const summary = `A complete overview of ${data.child.firstName}'s assessment, AI analysis, and recommended path toward ${data.topCareerMatch}.`;

  const report = await db.careerReport.create({
    data: {
      recommendationId,
      title,
      summary,
      pdfPath,
    },
  });

  revalidatePath(`/dashboard/reports/${recommendationId}`);
  revalidatePath("/dashboard/reports");
  revalidatePath("/dashboard");

  return { success: true, reportId: report.id };
}