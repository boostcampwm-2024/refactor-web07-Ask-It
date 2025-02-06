import axios from 'axios';
import { z } from 'zod';

export const QuestionShorteningRequestSchema = z.object({
  token: z.string(),
  sessionId: z.string(),
  body: z.string().min(0),
});

export const QuestionShorteningResponseSchema = z.object({
  result: z.object({
    question: z.string(),
  }),
});

export type QuestionShorteningRequest = z.infer<typeof QuestionShorteningRequestSchema>;

export type QuestionShorteningResponse = z.infer<typeof QuestionShorteningResponseSchema>;

export const postQuestionShortening = (body: QuestionShorteningRequest) =>
  axios
    .post<QuestionShorteningResponse>('/api/ai/question-shorten', QuestionShorteningRequestSchema.parse(body))
    .then((res) => QuestionShorteningResponseSchema.parse(res.data));
