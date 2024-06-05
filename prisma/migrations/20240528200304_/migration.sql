/*
  Warnings:

  - You are about to alter the column `photos` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `photos` JSON NULL;
