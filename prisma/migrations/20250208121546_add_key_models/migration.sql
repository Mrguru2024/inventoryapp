-- CreateTable
CREATE TABLE `Key` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `partNumber` VARCHAR(191) NOT NULL,
    `year` VARCHAR(191) NOT NULL,
    `make` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `fccId` VARCHAR(191) NULL,
    `icNumber` VARCHAR(191) NULL,
    `continentalNumber` VARCHAR(191) NULL,
    `frequency` VARCHAR(191) NOT NULL,
    `battery` VARCHAR(191) NOT NULL,
    `emergencyKey` VARCHAR(191) NULL,
    `testKey` VARCHAR(191) NULL,
    `manufacturer` VARCHAR(191) NOT NULL,
    `buttons` JSON NOT NULL,
    `notes` VARCHAR(191) NULL,
    `status` ENUM('AVAILABLE', 'CHECKED_OUT', 'MAINTENANCE', 'LOST') NOT NULL DEFAULT 'AVAILABLE',

    UNIQUE INDEX `Key_partNumber_key`(`partNumber`),
    INDEX `Key_make_model_year_idx`(`make`, `model`, `year`),
    INDEX `Key_partNumber_idx`(`partNumber`),
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

-- AddForeignKey
ALTER TABLE `KeyCheckout` ADD CONSTRAINT `KeyCheckout_keyId_fkey` FOREIGN KEY (`keyId`) REFERENCES `Key`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KeyCheckout` ADD CONSTRAINT `KeyCheckout_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
