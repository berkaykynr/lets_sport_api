-- DropIndex
DROP INDEX `EventRequest_eventId_fkey` ON `EventRequest`;

-- AlterTable
ALTER TABLE `EventRequest` ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT false;
