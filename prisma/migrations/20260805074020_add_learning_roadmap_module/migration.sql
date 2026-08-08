-- CreateTable
CREATE TABLE "learning_roadmaps" (
    "id" TEXT NOT NULL,
    "recommendationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "estimatedDuration" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_roadmaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_phases" (
    "id" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "estimatedWeeks" INTEGER NOT NULL,

    CONSTRAINT "roadmap_phases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_resources" (
    "id" TEXT NOT NULL,
    "phaseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "estimatedHours" INTEGER NOT NULL,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "isFree" BOOLEAN NOT NULL DEFAULT true,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "learning_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestones" (
    "id" TEXT NOT NULL,
    "phaseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "milestones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "learning_roadmaps_recommendationId_key" ON "learning_roadmaps"("recommendationId");

-- CreateIndex
CREATE INDEX "roadmap_phases_roadmapId_idx" ON "roadmap_phases"("roadmapId");

-- CreateIndex
CREATE INDEX "learning_resources_phaseId_idx" ON "learning_resources"("phaseId");

-- CreateIndex
CREATE INDEX "milestones_phaseId_idx" ON "milestones"("phaseId");

-- AddForeignKey
ALTER TABLE "learning_roadmaps" ADD CONSTRAINT "learning_roadmaps_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "career_recommendations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_phases" ADD CONSTRAINT "roadmap_phases_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "learning_roadmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_resources" ADD CONSTRAINT "learning_resources_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "roadmap_phases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "roadmap_phases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
