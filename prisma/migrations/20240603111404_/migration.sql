-- AlterTable
ALTER TABLE `User` ADD COLUMN `is_premium` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is_validated` BOOLEAN NOT NULL DEFAULT false;
