-- CreateTable
CREATE TABLE `TransponderKey` (
    `id` VARCHAR(191) NOT NULL,
    `make` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `yearStart` INTEGER NOT NULL,
    `yearEnd` INTEGER NULL,
    `transponderType` VARCHAR(191) NOT NULL,
    `chipType` VARCHAR(191) NOT NULL,
    `compatibleParts` VARCHAR(191) NOT NULL,
    `frequency` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `dualSystem` BOOLEAN NOT NULL DEFAULT false,
    `fccId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TransponderInventory` (
    `id` VARCHAR(191) NOT NULL,
    `transponderKeyId` VARCHAR(191) NOT NULL,
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

-- CreateTable
CREATE TABLE `Inventory` (
    `id` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `stockCount` INTEGER NOT NULL DEFAULT 0,
    `lowStockThreshold` INTEGER NOT NULL DEFAULT 5,
    `price` DOUBLE NOT NULL,
    `fccId` VARCHAR(191) NULL,
    `frequency` VARCHAR(191) NULL,
    `purchaseSource` VARCHAR(191) NULL,
    `isSmartKey` BOOLEAN NOT NULL DEFAULT false,
    `isTransponderKey` BOOLEAN NOT NULL DEFAULT false,
    `carMake` VARCHAR(191) NULL,
    `carModel` VARCHAR(191) NULL,
    `carYear` INTEGER NULL,
    `notes` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `technicianId` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NULL,
    `transponderKeyId` VARCHAR(191) NULL,

    UNIQUE INDEX `Inventory_sku_key`(`sku`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `TransponderKey_make_idx` ON `TransponderKey`(`make`);

-- CreateIndex
CREATE INDEX `TransponderKey_model_idx` ON `TransponderKey`(`model`);

-- CreateIndex
CREATE INDEX `TransponderKey_yearStart_idx` ON `TransponderKey`(`yearStart`);

-- CreateIndex
CREATE INDEX `TransponderKey_transponderType_idx` ON `TransponderKey`(`transponderType`);

-- CreateIndex
CREATE INDEX `TransponderKey_fccId_idx` ON `TransponderKey`(`fccId`);

-- CreateIndex
CREATE INDEX `TransponderInventory_transponderKeyId_idx` ON `TransponderInventory`(`transponderKeyId`);

-- CreateIndex
CREATE INDEX `Inventory_brand_idx` ON `Inventory`(`brand`);

-- CreateIndex
CREATE INDEX `Inventory_model_idx` ON `Inventory`(`model`);

-- CreateIndex
CREATE INDEX `Inventory_carMake_idx` ON `Inventory`(`carMake`);

-- CreateIndex
CREATE INDEX `Inventory_carModel_idx` ON `Inventory`(`carModel`);

-- CreateIndex
CREATE INDEX `Inventory_carYear_idx` ON `Inventory`(`carYear`);

-- CreateIndex
CREATE INDEX `Inventory_fccId_idx` ON `Inventory`(`fccId`);

-- CreateIndex
CREATE INDEX `Inventory_technicianId_idx` ON `Inventory`(`technicianId`);

-- CreateIndex
CREATE INDEX `Inventory_createdBy_idx` ON `Inventory`(`createdBy`);

-- CreateIndex
CREATE INDEX `Inventory_transponderKeyId_idx` ON `Inventory`(`transponderKeyId`);

-- AddForeignKey
ALTER TABLE `TransponderInventory` ADD CONSTRAINT `TransponderInventory_transponderKeyId_fkey` FOREIGN KEY (`transponderKeyId`) REFERENCES `TransponderKey`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_transponderKeyId_fkey` FOREIGN KEY (`transponderKeyId`) REFERENCES `TransponderKey`(`id`) ON DELETE SET NULL ON UPDATE CASCADE; 