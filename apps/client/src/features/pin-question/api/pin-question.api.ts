import axios from 'axios';
import { z } from 'zod';

export const PatchQuestionPinnedRequestSchema = z.object({
  token: z.string(),
  sessionId: z.string(),
  pinned: z.boolean(),
});

export const PatchQuestionPinnedResponseSchema = z.object({
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

export type PatchQuestionPinnedRequestDTO = z.infer<typeof PatchQuestionPinnedRequestSchema>;

export type PatchQuestionPinnedResponseDTO = z.infer<typeof PatchQuestionPinnedResponseSchema>;

export const patchQuestionPinned = (questionId: number, body: PatchQuestionPinnedRequestDTO) =>
  axios
    .patch<PatchQuestionPinnedResponseDTO>(
      `/api/questions/${questionId}/pinned`,
      PatchQuestionPinnedRequestSchema.parse(body),
    )
    .then((res) => PatchQuestionPinnedResponseSchema.parse(res.data));
