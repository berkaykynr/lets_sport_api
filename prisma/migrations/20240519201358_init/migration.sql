-- CreateTable
CREATE TABLE `TurkeyAddress` (
    `id` VARCHAR(191) NOT NULL,
    `city` JSON NULL,

    UNIQUE INDEX `TurkeyAddress_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
