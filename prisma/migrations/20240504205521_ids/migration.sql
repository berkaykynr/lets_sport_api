/*
  Warnings:

  - You are about to drop the column `districtsId` on the `Cities` table. All the data in the column will be lost.
  - You are about to drop the column `streetsId` on the `Districts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_citiesId_fkey`;

-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_countriesId_fkey`;

-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_streetsId_fkey`;

-- DropForeignKey
ALTER TABLE `Cities` DROP FOREIGN KEY `Cities_countriesId_fkey`;

-- DropForeignKey
ALTER TABLE `Cities` DROP FOREIGN KEY `Cities_districtsId_fkey`;

-- DropForeignKey
ALTER TABLE `Districts` DROP FOREIGN KEY `Districts_streetsId_fkey`;

-- AlterTable
ALTER TABLE `Cities` DROP COLUMN `districtsId`;

-- AlterTable
ALTER TABLE `Districts` DROP COLUMN `streetsId`,
    ADD COLUMN `cityId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Streets` ADD COLUMN `districtId` VARCHAR(191) NULL;
