/*
  Warnings:

  - You are about to drop the column `photoId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Photo` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `photos` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_photoId_fkey`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `photoId`,
    MODIFY `photos` JSON NOT NULL,
    MODIFY `selected_branches` JSON NULL,
    MODIFY `profile_photo` LONGBLOB NULL;

-- DropTable
DROP TABLE `Photo`;
