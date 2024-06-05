/*
  Warnings:

  - You are about to drop the column `Name` on the `Cities` table. All the data in the column will be lost.
  - You are about to drop the column `Code` on the `Countries` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `Countries` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `Districts` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `Streets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Cities` DROP COLUMN `Name`,
    ADD COLUMN `name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Countries` DROP COLUMN `Code`,
    DROP COLUMN `Name`,
    ADD COLUMN `code` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Districts` DROP COLUMN `Name`,
    ADD COLUMN `name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Streets` DROP COLUMN `Name`,
    ADD COLUMN `name` VARCHAR(191) NULL;
