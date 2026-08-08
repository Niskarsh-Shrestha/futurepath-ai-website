import { renderToBuffer } from "@react-pdf/renderer";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

import { ReportDocument } from "@/lib/reports/report-template";
import type { ReportData } from "@/lib/reports/report-types";

export async function generateReportPdf(
  data: ReportData,
  recommendationId: string
): Promise<string> {
  const document = <ReportDocument data={data} />;

  const buffer = await renderToBuffer(document);

  const fileName = `report-${recommendationId}.pdf`;

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "reports"
  );

  await mkdir(uploadDir, { recursive: true });

  await writeFile(path.join(uploadDir, fileName), buffer);

  return `/uploads/reports/${fileName}`;
}