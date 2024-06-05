-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_districtsId_fkey`;

-- DropIndex
DROP INDEX `Address_citiesId_fkey` ON `Address`;

-- DropIndex
DROP INDEX `Address_countriesId_fkey` ON `Address`;

-- DropIndex
DROP INDEX `Address_streetsId_fkey` ON `Address`;

-- DropIndex
DROP INDEX `Cities_countriesId_fkey` ON `Cities`;
