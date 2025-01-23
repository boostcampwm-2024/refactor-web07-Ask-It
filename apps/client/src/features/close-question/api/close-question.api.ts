import axios from 'axios';
import { z } from 'zod';

export const PatchQuestionClosedRequestSchema = z.object({
  token: z.string(),
  sessionId: z.string(),
  closed: z.boolean(),
});

export const PatchQuestionClosedResponseSchema = z.object({
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

export type PatchQuestionClosedRequestDTO = z.infer<typeof PatchQuestionClosedRequestSchema>;

export type PatchQuestionClosedResponseDTO = z.infer<typeof PatchQuestionClosedResponseSchema>;

export const patchQuestionClosed = (questionId: number, body: PatchQuestionClosedRequestDTO) =>
  axios
    .patch<PatchQuestionClosedResponseDTO>(
      `/api/questions/${questionId}/closed`,
      PatchQuestionClosedRequestSchema.parse(body),
    )
    .then((res) => PatchQuestionClosedResponseSchema.parse(res.data));
