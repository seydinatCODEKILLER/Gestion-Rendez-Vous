/*
  Warnings:

  - A unique constraint covering the columns `[matricule]` on the table `patients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `matricule` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "matricule" VARCHAR(20) NOT NULL,
ADD COLUMN     "photo" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "patients_matricule_key" ON "patients"("matricule");
