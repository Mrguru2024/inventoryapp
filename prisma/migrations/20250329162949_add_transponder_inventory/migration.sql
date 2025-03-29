-- CreateTable
CREATE TABLE `TransponderInventory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transponderKeyId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `minimumStock` INTEGER NOT NULL DEFAULT 5,
    `location` VARCHAR(191) NOT NULL,
    `supplier` VARCHAR(191) NOT NULL,
    `lastOrdered` DATETIME(3) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TransponderInventory_transponderKeyId_key`(`transponderKeyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TransponderInventory` ADD CONSTRAINT `TransponderInventory_transponderKeyId_fkey` FOREIGN KEY (`transponderKeyId`) REFERENCES `TransponderKey`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
