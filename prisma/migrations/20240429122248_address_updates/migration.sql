/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `is_premium` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `is_validated` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `User_email_key` ON `User`;

-- DropIndex
DROP INDEX `User_username_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `address`,
    DROP COLUMN `is_premium`,
    DROP COLUMN `is_validated`,
    ADD COLUMN `addressId` VARCHAR(191) NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `first_name` VARCHAR(191) NULL,
    MODIFY `last_name` VARCHAR(191) NULL,
    MODIFY `username` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NULL,
    MODIFY `phone` VARCHAR(191) NULL,
    MODIFY `sex` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `Address` (
    `id` VARCHAR(191) NOT NULL,
    `countriesId` VARCHAR(191) NULL,
    `citiesId` VARCHAR(191) NULL,
    `districtsId` VARCHAR(191) NULL,
    `streetsId` VARCHAR(191) NULL,

    UNIQUE INDEX `Address_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Countries` (
    `id` VARCHAR(191) NOT NULL,
    `Name` VARCHAR(191) NULL,
    `Code` VARCHAR(191) NULL,

    UNIQUE INDEX `Countries_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cities` (
    `id` VARCHAR(191) NOT NULL,
    `Name` VARCHAR(191) NULL,
    `countriesId` VARCHAR(191) NULL,
    `districtsId` VARCHAR(191) NULL,

    UNIQUE INDEX `Cities_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Districts` (
    `id` VARCHAR(191) NOT NULL,
    `Name` VARCHAR(191) NULL,
    `streetsId` VARCHAR(191) NULL,

    UNIQUE INDEX `Districts_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Streets` (
    `id` VARCHAR(191) NOT NULL,
    `Name` VARCHAR(191) NULL,

    UNIQUE INDEX `Streets_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_id_key` ON `User`(`id`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_countriesId_fkey` FOREIGN KEY (`countriesId`) REFERENCES `Countries`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_citiesId_fkey` FOREIGN KEY (`citiesId`) REFERENCES `Cities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_districtsId_fkey` FOREIGN KEY (`districtsId`) REFERENCES `Districts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_streetsId_fkey` FOREIGN KEY (`streetsId`) REFERENCES `Streets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cities` ADD CONSTRAINT `Cities_districtsId_fkey` FOREIGN KEY (`districtsId`) REFERENCES `Districts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cities` ADD CONSTRAINT `Cities_countriesId_fkey` FOREIGN KEY (`countriesId`) REFERENCES `Countries`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Districts` ADD CONSTRAINT `Districts_streetsId_fkey` FOREIGN KEY (`streetsId`) REFERENCES `Streets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
