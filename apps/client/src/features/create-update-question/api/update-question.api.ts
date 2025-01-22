import axios from 'axios';
import { z } from 'zod';

export const PatchQuestionBodyRequestSchema = z.object({
  token: z.string(),
  sessionId: z.string(),
  body: z.string().min(1),
});

export const PatchQuestionBodyResponseSchema = z.object({
  question: z.object({
    questionId: z.number(),
    createUserToken: z.string(),
    sessionId: z.string(),
    body: z.string(),
    closed: z.boolean(),
    pinned: z.boolean(),
    createdAt: z.string(),
  }),
});

export type PatchQuestionBodyRequestDTO = z.infer<typeof PatchQuestionBodyRequestSchema>;

export type PatchQuestionBodyResponseDTO = z.infer<typeof PatchQuestionBodyResponseSchema>;

export const patchQuestionBody = (questionId: number, body: PatchQuestionBodyRequestDTO) =>
  axios
    .patch<PatchQuestionBodyResponseDTO>(
      `/api/questions/${questionId}/body`,
      PatchQuestionBodyRequestSchema.parse(body),
    )
    .then((res) => PatchQuestionBodyResponseSchema.parse(res.data));
