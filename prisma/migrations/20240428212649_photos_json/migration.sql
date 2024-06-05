/*
  Warnings:

  - You are about to drop the `Photo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PhotoToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `photos` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_PhotoToUser` DROP FOREIGN KEY `_PhotoToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_PhotoToUser` DROP FOREIGN KEY `_PhotoToUser_B_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `photos` JSON NOT NULL;

-- DropTable
DROP TABLE `Photo`;

-- DropTable
DROP TABLE `_PhotoToUser`;
