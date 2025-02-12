-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'TECHNICIAN') NOT NULL DEFAULT 'TECHNICIAN',
    `emailVerified` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inventory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sku` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `stockCount` INTEGER NOT NULL DEFAULT 0,
    `lowStockThreshold` INTEGER NOT NULL DEFAULT 5,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Inventory_sku_key`(`sku`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Request` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `technicianId` INTEGER NOT NULL,
    `inventoryId` INTEGER NOT NULL,
    `quantityRequested` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Key` (
    `id` VARCHAR(191) NOT NULL,
    `fccId` VARCHAR(191) NOT NULL,
    `icId` VARCHAR(191) NOT NULL,
    `manufacturer` VARCHAR(191) NOT NULL,
    `manufacturerPartNumber` VARCHAR(191) NOT NULL,
    `frequency` VARCHAR(191) NOT NULL,
    `battery` VARCHAR(191) NOT NULL,
    `buttons` VARCHAR(191) NOT NULL,
    `emergencyKey` VARCHAR(191) NULL,
    `testKey` VARCHAR(191) NULL,
    `replacesPN` VARCHAR(191) NOT NULL,
    `aftermarketFor` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Key_fccId_idx`(`fccId`),
    INDEX `Key_manufacturerPartNumber_idx`(`manufacturerPartNumber`),
    INDEX `Key_replacesPN_idx`(`replacesPN`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KeyCheckout` (
    `id` VARCHAR(191) NOT NULL,
    `keyId` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `checkedOut` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `checkedIn` DATETIME(3) NULL,
    `notes` VARCHAR(191) NULL,

    INDEX `KeyCheckout_keyId_idx`(`keyId`),
    INDEX `KeyCheckout_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TransponderInventory` (
    `id` VARCHAR(191) NOT NULL,
    `transponderType` VARCHAR(191) NOT NULL,
    `chipType` VARCHAR(191) NOT NULL DEFAULT '[]',
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SearchAnalytics` (
    `id` VARCHAR(191) NOT NULL,
    `query` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `resultsCount` INTEGER NOT NULL,
    `filters` VARCHAR(191) NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transponder` (
    `id` VARCHAR(191) NOT NULL,
    `make` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `yearStart` INTEGER NOT NULL,
    `yearEnd` INTEGER NULL,
    `transponderType` VARCHAR(191) NOT NULL,
    `chipType` TEXT NOT NULL,
    `frequency` VARCHAR(191) NOT NULL,
    `compatibleParts` TEXT NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Transponder_make_model_idx`(`make`, `model`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_technicianId_fkey` FOREIGN KEY (`technicianId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `Inventory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KeyCheckout` ADD CONSTRAINT `KeyCheckout_keyId_fkey` FOREIGN KEY (`keyId`) REFERENCES `Key`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KeyCheckout` ADD CONSTRAINT `KeyCheckout_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
