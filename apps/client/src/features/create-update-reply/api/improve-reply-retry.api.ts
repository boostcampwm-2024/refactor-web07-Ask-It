import axios from 'axios';
import { z } from 'zod';

export const RetryReplyImprovementRequestSchema = z.object({
  token: z.string(),
  sessionId: z.string(),
  originalQuestion: z.string(),
  original: z.string(),
  received: z.string(),
  retryMessage: z.string(),
});

export const RetryReplyImprovementResponseSchema = z.object({
  result: z.object({
    reply: z.string(),
  }),
});

export type RetryReplyImprovementRequest = z.infer<typeof RetryReplyImprovementRequestSchema>;

export type RetryReplyImprovementResponse = z.infer<typeof RetryReplyImprovementResponseSchema>;

export const postRetryReplyImprovement = (body: RetryReplyImprovementRequest) =>
  axios
    .post<RetryReplyImprovementResponse>('/api/ai/reply-improve-retry', RetryReplyImprovementRequestSchema.parse(body))
    .then((res) => RetryReplyImprovementResponseSchema.parse(res.data));
