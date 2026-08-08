-- CreateTable
CREATE TABLE "career_reports" (
    "id" TEXT NOT NULL,
    "recommendationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "pdfPath" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "career_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "career_reports_recommendationId_key" ON "career_reports"("recommendationId");

-- AddForeignKey
ALTER TABLE "career_reports" ADD CONSTRAINT "career_reports_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "career_recommendations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
