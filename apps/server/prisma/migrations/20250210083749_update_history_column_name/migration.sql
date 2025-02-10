/*
  Warnings:

  - You are about to drop the column `after` on the `PromptHistory` table. All the data in the column will be lost.
  - You are about to drop the column `before` on the `PromptHistory` table. All the data in the column will be lost.
  - Added the required column `request` to the `PromptHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `response` to the `PromptHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PromptHistory" DROP COLUMN "after",
DROP COLUMN "before",
ADD COLUMN     "request" TEXT NOT NULL,
ADD COLUMN     "response" TEXT NOT NULL;
