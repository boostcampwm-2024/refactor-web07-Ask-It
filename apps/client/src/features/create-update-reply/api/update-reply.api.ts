import axios from 'axios';
import { z } from 'zod';

export const PatchReplyBodyRequestSchema = z.object({
  token: z.string(),
  sessionId: z.string(),
  body: z.string().min(1),
});

export const PatchReplyBodyResponseSchema = z.object({
  reply: z.object({
    replyId: z.number(),
    createUserToken: z.string(),
    sessionId: z.string(),
    questionId: z.number(),
    body: z.string(),
    createdAt: z.string(),
  }),
});

export type PatchReplyBodyRequestDTO = z.infer<typeof PatchReplyBodyRequestSchema>;

export type PatchReplyBodyResponseDTO = z.infer<typeof PatchReplyBodyResponseSchema>;

export const patchReplyBody = (replyId: number, body: PatchReplyBodyRequestDTO) =>
  axios
    .patch<PatchReplyBodyResponseDTO>(`/api/replies/${replyId}/body`, PatchReplyBodyRequestSchema.parse(body))
    .then((res) => PatchReplyBodyResponseSchema.parse(res.data));
