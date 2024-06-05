/*
  Warnings:

  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Countries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Districts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Streets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_addressId_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `address` JSON NULL;

-- DropTable
DROP TABLE `Address`;

-- DropTable
DROP TABLE `Cities`;

-- DropTable
DROP TABLE `Countries`;

-- DropTable
DROP TABLE `Districts`;

-- DropTable
DROP TABLE `Streets`;
