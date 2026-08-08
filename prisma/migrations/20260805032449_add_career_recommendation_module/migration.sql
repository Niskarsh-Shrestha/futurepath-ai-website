-- CreateTable
CREATE TABLE "career_recommendations" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "careerTitle" TEXT NOT NULL,
    "careerCategory" TEXT NOT NULL,
    "matchScore" INTEGER NOT NULL,
    "salaryRange" TEXT NOT NULL,
    "educationLevel" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "futureDemand" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "career_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_paths" (
    "id" TEXT NOT NULL,
    "recommendationId" TEXT NOT NULL,
    "step" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "career_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_gaps" (
    "id" TEXT NOT NULL,
    "recommendationId" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "currentLevel" INTEGER NOT NULL,
    "requiredLevel" INTEGER NOT NULL,
    "priority" TEXT NOT NULL,

    CONSTRAINT "skill_gaps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "career_recommendations_analysisId_idx" ON "career_recommendations"("analysisId");

-- CreateIndex
CREATE INDEX "career_paths_recommendationId_idx" ON "career_paths"("recommendationId");

-- CreateIndex
CREATE INDEX "skill_gaps_recommendationId_idx" ON "skill_gaps"("recommendationId");

-- AddForeignKey
ALTER TABLE "career_recommendations" ADD CONSTRAINT "career_recommendations_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "ai_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_paths" ADD CONSTRAINT "career_paths_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "career_recommendations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_gaps" ADD CONSTRAINT "skill_gaps_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "career_recommendations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
