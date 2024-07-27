/*
  Warnings:

  - You are about to drop the column `conversationId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Conversation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ConversationToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_conversationId_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_receiverId_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_senderId_fkey`;

-- DropForeignKey
ALTER TABLE `Session` DROP FOREIGN KEY `Session_userId_fkey`;

-- DropForeignKey
ALTER TABLE `_ConversationToUser` DROP FOREIGN KEY `_ConversationToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ConversationToUser` DROP FOREIGN KEY `_ConversationToUser_B_fkey`;

-- AlterTable
ALTER TABLE `Message` DROP COLUMN `conversationId`;

-- DropTable
DROP TABLE `Conversation`;

-- DropTable
DROP TABLE `Session`;

-- DropTable
DROP TABLE `_ConversationToUser`;
