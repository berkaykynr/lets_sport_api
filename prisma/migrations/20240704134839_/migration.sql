/*
  Warnings:

  - Made the column `latitude` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `branch` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Event` MODIFY `latitude` VARCHAR(191) NOT NULL,
    MODIFY `longitude` VARCHAR(191) NOT NULL,
    MODIFY `address` VARCHAR(191) NOT NULL,
    MODIFY `branch` VARCHAR(191) NOT NULL;
