import axios from 'axios';
import { z } from 'zod';

export const QuestionImprovementRequestSchema = z.object({
  token: z.string(),
  sessionId: z.string(),
  body: z.string().min(0),
});

export const QuestionImprovementResponseSchema = z.object({
  result: z.object({
    question: z.string(),
  }),
});

export type QuestionImprovementRequest = z.infer<typeof QuestionImprovementRequestSchema>;

export type QuestionImprovementResponse = z.infer<typeof QuestionImprovementResponseSchema>;

export const postQuestionImprovement = (body: QuestionImprovementRequest) =>
  axios
    .post<QuestionImprovementResponse>('/api/ai/question-improve', QuestionImprovementRequestSchema.parse(body))
    .then((res) => QuestionImprovementResponseSchema.parse(res.data));
