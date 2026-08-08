-- CreateTable
CREATE TABLE "ai_analyses" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "strengths" TEXT[],
    "weaknesses" TEXT[],
    "learningStyleAnalysis" TEXT NOT NULL,
    "personalityAnalysis" TEXT NOT NULL,
    "careerInterestAnalysis" TEXT NOT NULL,
    "confidenceScore" INTEGER NOT NULL,
    "model" TEXT NOT NULL,
    "promptVersion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_matches" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "career" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "career_matches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_analyses_assessmentId_key" ON "ai_analyses"("assessmentId");

-- CreateIndex
CREATE INDEX "career_matches_analysisId_idx" ON "career_matches"("analysisId");

-- AddForeignKey
ALTER TABLE "ai_analyses" ADD CONSTRAINT "ai_analyses_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_matches" ADD CONSTRAINT "career_matches_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "ai_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
