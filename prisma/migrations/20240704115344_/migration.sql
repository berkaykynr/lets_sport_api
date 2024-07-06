-- AlterTable
ALTER TABLE `User` ADD COLUMN `eventId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Event` (
    `id` VARCHAR(191) NOT NULL,
    `eventDate` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `participants` JSON NOT NULL,
    `latitude` INTEGER NULL,
    `longitude` INTEGER NULL,
    `address` JSON NULL,
    `branch` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Event_id_key`(`id`),
    UNIQUE INDEX `Event_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
