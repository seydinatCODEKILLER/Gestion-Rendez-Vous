/*
  Warnings:

  - You are about to drop the column `date_heure` on the `rendez_vous` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[medecin_id,date,heure,statut]` on the table `rendez_vous` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `rendez_vous` table without a default value. This is not possible if the table is not empty.
  - Added the required column `heure` to the `rendez_vous` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "rendez_vous_medecin_id_date_heure_idx";

-- DropIndex
DROP INDEX "rendez_vous_patient_id_date_heure_idx";

-- AlterTable
ALTER TABLE "rendez_vous" DROP COLUMN "date_heure",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "heure" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "rendez_vous_medecin_id_date_idx" ON "rendez_vous"("medecin_id", "date");

-- CreateIndex
CREATE INDEX "rendez_vous_patient_id_date_idx" ON "rendez_vous"("patient_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "rendez_vous_medecin_id_date_heure_statut_key" ON "rendez_vous"("medecin_id", "date", "heure", "statut");
