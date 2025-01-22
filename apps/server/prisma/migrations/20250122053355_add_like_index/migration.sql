/*
  Warnings:

  - A unique constraint covering the columns `[question_id,create_user_token]` on the table `QuestionLike` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reply_id,create_user_token]` on the table `ReplyLike` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "QuestionLike_create_user_token_question_id_key";

-- DropIndex
DROP INDEX "ReplyLike_create_user_token_reply_id_key";

-- CreateIndex
CREATE INDEX "QuestionLike_question_id_create_user_token_idx" ON "QuestionLike"("question_id", "create_user_token");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionLike_question_id_create_user_token_key" ON "QuestionLike"("question_id", "create_user_token");

-- CreateIndex
CREATE INDEX "ReplyLike_reply_id_create_user_token_idx" ON "ReplyLike"("reply_id", "create_user_token");

-- CreateIndex
CREATE UNIQUE INDEX "ReplyLike_reply_id_create_user_token_key" ON "ReplyLike"("reply_id", "create_user_token");
