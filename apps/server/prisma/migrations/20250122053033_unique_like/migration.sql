/*
  Warnings:

  - A unique constraint covering the columns `[create_user_token,question_id]` on the table `QuestionLike` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[create_user_token,reply_id]` on the table `ReplyLike` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "QuestionLike_create_user_token_question_id_key" ON "QuestionLike"("create_user_token", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "ReplyLike_create_user_token_reply_id_key" ON "ReplyLike"("create_user_token", "reply_id");
