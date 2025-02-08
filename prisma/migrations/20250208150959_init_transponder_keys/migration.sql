-- CreateTable
CREATE TABLE `TransponderKey` (
    `id` VARCHAR(191) NOT NULL,
    `make` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `yearStart` INTEGER NOT NULL,
    `yearEnd` INTEGER NULL,
    `transponderType` VARCHAR(191) NOT NULL,
    `chipType` VARCHAR(191) NOT NULL,
    `compatibleParts` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `dualSystem` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `TransponderKey_make_model_idx`(`make`, `model`),
    INDEX `TransponderKey_transponderType_idx`(`transponderType`),
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
    `chipType` VARCHAR(191) NOT NULL,
    `compatibleParts` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `vatsEnabled` BOOLEAN NULL DEFAULT false,
    `vatsSystem` VARCHAR(191) NULL,
    `dualSystem` BOOLEAN NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Transponder_make_model_idx`(`make`, `model`),
    INDEX `Transponder_transponderType_idx`(`transponderType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
