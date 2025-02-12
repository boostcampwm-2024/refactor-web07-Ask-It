import axios from 'axios';
import { z } from 'zod';

export const RetryImproveQuestionRequestSchema = z.object({
  token: z.string(),
  sessionId: z.string(),
  original: z.string(),
  received: z.string(),
  retryMessage: z.string(),
});

export const RetryImproveQuestionResponseSchema = z.object({
  result: z.object({
    question: z.string(),
  }),
});

export type RetryImproveQuestionRequest = z.infer<typeof RetryImproveQuestionRequestSchema>;

export type RetryImproveQuestionResponse = z.infer<typeof RetryImproveQuestionResponseSchema>;

export const postRetryQuestionImprovement = (body: RetryImproveQuestionRequest) =>
  axios
    .post<RetryImproveQuestionResponse>('/api/ai/question-improve-retry', RetryImproveQuestionRequestSchema.parse(body))
    .then((res) => RetryImproveQuestionResponseSchema.parse(res.data));
