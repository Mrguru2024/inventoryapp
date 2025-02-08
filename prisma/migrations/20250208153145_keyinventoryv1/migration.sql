/*
  Warnings:

  - You are about to drop the `Transponder` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `TransponderKey` ADD COLUMN `frequency` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Transponder`;

-- CreateIndex
CREATE INDEX `TransponderKey_chipType_idx` ON `TransponderKey`(`chipType`);
