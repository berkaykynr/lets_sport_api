/*
  Warnings:

  - You are about to drop the column `username` on the `Event` table. All the data in the column will be lost.
  - Made the column `userId` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Event` DROP FOREIGN KEY `Event_username_fkey`;

-- AlterTable
ALTER TABLE `Event` DROP COLUMN `username`,
    MODIFY `userId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
