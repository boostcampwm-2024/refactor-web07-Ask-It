/*
  Warnings:

  - Added the required column `roleType` to the `UserSessionToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserSessionToken" ADD COLUMN     "roleType" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Role" (
    "name" TEXT NOT NULL,
    "permissions" INTEGER[],

    CONSTRAINT "Role_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Permission" (
    "permission_id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("permission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permission_description_key" ON "Permission"("description");

-- AddForeignKey
ALTER TABLE "UserSessionToken" ADD CONSTRAINT "UserSessionToken_roleType_fkey" FOREIGN KEY ("roleType") REFERENCES "Role"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
