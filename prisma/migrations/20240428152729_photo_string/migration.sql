/*
  Warnings:

  - You are about to drop the column `photos` on the `User` table. All the data in the column will be lost.
  - Added the required column `photoId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `photos`,
    ADD COLUMN `photoId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `_PhotoToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PhotoToUser_AB_unique`(`A`, `B`),
    INDEX `_PhotoToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_PhotoToUser` ADD CONSTRAINT `_PhotoToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Photo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PhotoToUser` ADD CONSTRAINT `_PhotoToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
