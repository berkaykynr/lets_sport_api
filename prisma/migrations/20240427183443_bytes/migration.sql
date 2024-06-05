/*
  Warnings:

  - You are about to drop the `Photo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `photos` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `branches` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Photo` DROP FOREIGN KEY `Photo_userId_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `photos` JSON NOT NULL,
    MODIFY `profile_photo` LONGBLOB NOT NULL,
    MODIFY `branches` JSON NOT NULL;

-- DropTable
DROP TABLE `Photo`;
