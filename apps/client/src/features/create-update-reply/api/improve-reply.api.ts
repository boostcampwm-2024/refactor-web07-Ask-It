import axios from 'axios';
import { z } from 'zod';

export const ReplyImprovementRequestSchema = z.object({
  token: z.string(),
  sessionId: z.string(),
  body: z.string(),
  originalQuestion: z.string(),
});

export const ReplyImprovementResponseSchema = z.object({
  result: z.object({
    reply: z.string(),
  }),
});

export type ReplyImprovementRequest = z.infer<typeof ReplyImprovementRequestSchema>;

export type ReplyImprovementResponse = z.infer<typeof ReplyImprovementResponseSchema>;

export const postReplyImprovement = (body: ReplyImprovementRequest) =>
  axios
    .post<ReplyImprovementResponse>('/api/ai/reply-improve', ReplyImprovementRequestSchema.parse(body))
    .then((res) => ReplyImprovementResponseSchema.parse(res.data));
