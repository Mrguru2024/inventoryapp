-- Add new columns as nullable first
ALTER TABLE `Inventory` ADD COLUMN `createdById` VARCHAR(191) NULL;
ALTER TABLE `Inventory` ADD COLUMN `isDualSystem` BOOLEAN NOT NULL DEFAULT false;

-- Update existing rows with the first user's ID as createdById
UPDATE `Inventory` i
JOIN (SELECT id FROM `User` LIMIT 1) u
SET i.`createdById` = u.id
WHERE i.`createdById` IS NULL;

-- Add foreign key constraints
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add indexes
CREATE INDEX `Inventory_createdById_idx` ON `Inventory`(`createdById`);
CREATE INDEX `Inventory_status_idx` ON `Inventory`(`status`);
CREATE INDEX `Inventory_sku_idx` ON `Inventory`(`sku`);

-- Make createdById required
ALTER TABLE `Inventory` MODIFY COLUMN `createdById` VARCHAR(191) NOT NULL; 