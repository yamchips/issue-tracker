-- AlterTable
ALTER TABLE `User` ADD COLUMN `hashedPassword` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Issue_assignedToUserId_idx` ON `Issue`(`assignedToUserId`);
