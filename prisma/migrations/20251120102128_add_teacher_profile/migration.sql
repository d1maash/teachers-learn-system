-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "city" TEXT,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "goals" TEXT,
ADD COLUMN     "heardAboutUs" TEXT,
ADD COLUMN     "heardDetails" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "profileCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profileCompletedAt" TIMESTAMP(3),
ADD COLUMN     "subjects" TEXT,
ADD COLUMN     "telegram" TEXT,
ADD COLUMN     "university" TEXT;
