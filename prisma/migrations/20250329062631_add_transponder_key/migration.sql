/*
  Warnings:

  - The primary key for the `TransponderKey` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `TransponderKey` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Key` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KeyCheckout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SearchAnalytics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransponderInventory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `KeyCheckout` DROP FOREIGN KEY `KeyCheckout_keyId_fkey`;

-- DropForeignKey
ALTER TABLE `KeyCheckout` DROP FOREIGN KEY `KeyCheckout_userId_fkey`;

-- DropIndex
DROP INDEX `TransponderKey_chipType_idx` ON `TransponderKey`;

-- DropIndex
DROP INDEX `TransponderKey_transponderType_idx` ON `TransponderKey`;

-- AlterTable
ALTER TABLE `TransponderKey` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `yearStart` INTEGER NULL,
    MODIFY `notes` TEXT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `User` DROP COLUMN `emailVerified`,
    ADD COLUMN `resetToken` VARCHAR(191) NULL,
    ADD COLUMN `resetTokenExpiry` DATETIME(3) NULL,
    MODIFY `role` ENUM('ADMIN', 'TECHNICIAN', 'CUSTOMER') NOT NULL DEFAULT 'TECHNICIAN';

-- DropTable
DROP TABLE `Key`;

-- DropTable
DROP TABLE `KeyCheckout`;

-- DropTable
DROP TABLE `SearchAnalytics`;

-- DropTable
DROP TABLE `TransponderInventory`;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
