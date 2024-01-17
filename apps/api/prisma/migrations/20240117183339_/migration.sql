/*
  Warnings:

  - Added the required column `mutualInsuranceNumber` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `socialSecurityNumber` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "mutualInsuranceNumber" TEXT NOT NULL,
ADD COLUMN     "socialSecurityNumber" TEXT NOT NULL;
