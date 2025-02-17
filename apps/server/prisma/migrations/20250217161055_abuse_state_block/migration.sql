/*
  Warnings:

  - The values [ABUSE] on the enum `AbuseState` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AbuseState_new" AS ENUM ('PENDING', 'SAFE', 'BLOCKED');
ALTER TABLE "Chatting" ALTER COLUMN "abuse" DROP DEFAULT;
ALTER TABLE "Chatting" ALTER COLUMN "abuse" TYPE "AbuseState_new" USING ("abuse"::text::"AbuseState_new");
ALTER TYPE "AbuseState" RENAME TO "AbuseState_old";
ALTER TYPE "AbuseState_new" RENAME TO "AbuseState";
DROP TYPE "AbuseState_old";
ALTER TABLE "Chatting" ALTER COLUMN "abuse" SET DEFAULT 'PENDING';
COMMIT;
