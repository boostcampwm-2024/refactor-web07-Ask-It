-- CreateEnum
CREATE TYPE "AbuseState" AS ENUM ('SAFE', 'PENDING', 'ABUSE');

-- AlterTable
ALTER TABLE "Chatting" 
ALTER COLUMN "abuse" DROP DEFAULT,
ALTER COLUMN "abuse" TYPE "AbuseState" USING 
  CASE 
    WHEN abuse = false THEN 'PENDING'::"AbuseState"
    ELSE 'SAFE'::"AbuseState"
  END,
ALTER COLUMN "abuse" SET DEFAULT 'PENDING'::"AbuseState";