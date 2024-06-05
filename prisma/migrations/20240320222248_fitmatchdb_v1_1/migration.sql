-- AlterTable
ALTER TABLE `User` ADD COLUMN `profile_photo` VARCHAR(191) NULL,
    MODIFY `photos` JSON NULL;
