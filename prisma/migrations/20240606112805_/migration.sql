/*
  Warnings:

  - You are about to alter the column `branches` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `branches` JSON NULL;
