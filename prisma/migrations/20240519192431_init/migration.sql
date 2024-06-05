/*
  Warnings:

  - You are about to drop the column `addressId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_addressId_fkey` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `addressId`;
