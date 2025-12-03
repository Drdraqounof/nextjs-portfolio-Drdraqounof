-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "tech" TEXT[] DEFAULT ARRAY[]::TEXT[];
