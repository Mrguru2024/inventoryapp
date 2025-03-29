/*
  Warnings:

  - You are about to alter the column `chipType` on the `TransponderKey` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `compatibleParts` on the `TransponderKey` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `TransponderKey` MODIFY `chipType` JSON NOT NULL,
    MODIFY `compatibleParts` JSON NULL;
