/*
  Warnings:

  - Added the required column `serviceId` to the `medecins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "medecins" ADD COLUMN     "serviceId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "libelle" VARCHAR(100) NOT NULL,
    "sousService" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "services_code_sousService_key" ON "services"("code", "sousService");

-- AddForeignKey
ALTER TABLE "medecins" ADD CONSTRAINT "medecins_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
