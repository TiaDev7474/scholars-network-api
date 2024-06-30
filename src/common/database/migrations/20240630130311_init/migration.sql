/*
  Warnings:

  - Made the column `id` on table `FriendRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FriendRequest" ALTER COLUMN "id" SET NOT NULL,
ADD CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("id");
