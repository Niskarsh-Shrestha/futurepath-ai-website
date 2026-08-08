-- AlterTable
ALTER TABLE "users" ADD COLUMN     "assessmentReminders" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "marketingEmails" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "roadmapUpdates" BOOLEAN NOT NULL DEFAULT true;
