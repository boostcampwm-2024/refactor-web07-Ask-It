/*
  Warnings:

  - You are about to drop the column `is_host` on the `UserSessionToken` table. All the data in the column will be lost.
  - You are about to drop the column `roleType` on the `UserSessionToken` table. All the data in the column will be lost.
  - Added the required column `role_type` to the `UserSessionToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserSessionToken" DROP CONSTRAINT "UserSessionToken_roleType_fkey";

-- AlterTable
ALTER TABLE "UserSessionToken" DROP COLUMN "is_host",
DROP COLUMN "roleType",
ADD COLUMN     "role_type" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserSessionToken" ADD CONSTRAINT "UserSessionToken_role_type_fkey" FOREIGN KEY ("role_type") REFERENCES "Role"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
