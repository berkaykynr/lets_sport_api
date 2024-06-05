/*
  Warnings:

  - You are about to drop the `Branch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BranchToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_BranchToUser` DROP FOREIGN KEY `_BranchToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_BranchToUser` DROP FOREIGN KEY `_BranchToUser_B_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `branches` JSON NULL;

-- DropTable
DROP TABLE `Branch`;

-- DropTable
DROP TABLE `_BranchToUser`;
