-- CreateEnum
CREATE TYPE "Specialite" AS ENUM ('GENERALISTE', 'CARDIOLOGUE', 'DENTISTE', 'PEDIATRE', 'DERMATOLOGUE');

-- CreateEnum
CREATE TYPE "StatutRendezVous" AS ENUM ('PLANIFIE', 'ANNULE', 'TERMINE', 'ABSENT');

-- CreateTable
CREATE TABLE "medecins" (
    "id" TEXT NOT NULL,
    "prenom" VARCHAR(100) NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "specialite" "Specialite" NOT NULL,
    "telephone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medecins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "prenom" VARCHAR(100) NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "date_naissance" TIMESTAMP(3) NOT NULL,
    "telephone" VARCHAR(20) NOT NULL,
    "adresse" VARCHAR(255) NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rendez_vous" (
    "id" TEXT NOT NULL,
    "date_heure" TIMESTAMP(3) NOT NULL,
    "statut" "StatutRendezVous" NOT NULL DEFAULT 'PLANIFIE',
    "medecin_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rendez_vous_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordonnances" (
    "id" TEXT NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "rendez_vous_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ordonnances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "medecins_email_key" ON "medecins"("email");

-- CreateIndex
CREATE INDEX "medecins_nom_prenom_idx" ON "medecins"("nom", "prenom");

-- CreateIndex
CREATE INDEX "patients_nom_prenom_idx" ON "patients"("nom", "prenom");

-- CreateIndex
CREATE INDEX "rendez_vous_medecin_id_date_heure_idx" ON "rendez_vous"("medecin_id", "date_heure");

-- CreateIndex
CREATE INDEX "rendez_vous_patient_id_date_heure_idx" ON "rendez_vous"("patient_id", "date_heure");

-- CreateIndex
CREATE UNIQUE INDEX "ordonnances_rendez_vous_id_key" ON "ordonnances"("rendez_vous_id");

-- AddForeignKey
ALTER TABLE "rendez_vous" ADD CONSTRAINT "rendez_vous_medecin_id_fkey" FOREIGN KEY ("medecin_id") REFERENCES "medecins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rendez_vous" ADD CONSTRAINT "rendez_vous_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordonnances" ADD CONSTRAINT "ordonnances_rendez_vous_id_fkey" FOREIGN KEY ("rendez_vous_id") REFERENCES "rendez_vous"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
