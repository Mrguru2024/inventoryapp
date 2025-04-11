/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Inventory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Inventory` DROP FOREIGN KEY `Inventory_createdBy_fkey`;

-- DropIndex
DROP INDEX `Inventory_brand_idx` ON `Inventory`;

-- DropIndex
DROP INDEX `Inventory_carMake_idx` ON `Inventory`;

-- DropIndex
DROP INDEX `Inventory_carModel_idx` ON `Inventory`;

-- DropIndex
DROP INDEX `Inventory_carYear_idx` ON `Inventory`;

-- DropIndex
DROP INDEX `Inventory_fccId_idx` ON `Inventory`;

-- DropIndex
DROP INDEX `Inventory_model_idx` ON `Inventory`;

-- AlterTable
ALTER TABLE `Inventory` DROP COLUMN `createdBy`,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE';
