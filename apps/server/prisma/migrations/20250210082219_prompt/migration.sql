-- CreateTable
CREATE TABLE "Prompt" (
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Prompt_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "PromptHistory" (
    "history_id" SERIAL NOT NULL,
    "before" TEXT NOT NULL,
    "after" TEXT NOT NULL,
    "prompt_name" TEXT NOT NULL,
    "result" TEXT NOT NULL,

    CONSTRAINT "PromptHistory_pkey" PRIMARY KEY ("history_id")
);

-- AddForeignKey
ALTER TABLE "PromptHistory" ADD CONSTRAINT "PromptHistory_prompt_name_fkey" FOREIGN KEY ("prompt_name") REFERENCES "Prompt"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
