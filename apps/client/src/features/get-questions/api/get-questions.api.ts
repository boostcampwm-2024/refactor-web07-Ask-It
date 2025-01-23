import axios from 'axios';
import { z } from 'zod';

import { QuestionSchema } from '@/entities/session';

export const GetQuestionsRequestSchema = z.object({
  sessionId: z.string(),
  token: z.string().optional(),
});

export const GetQuestionsResponseSchema = z.object({
  questions: z.array(QuestionSchema),
  isHost: z.boolean(),
  expired: z.boolean(),
  sessionTitle: z.string(),
});

export type GetQuestionsRequestDTO = z.infer<typeof GetQuestionsRequestSchema>;
export type GetQuestionsResponseDTO = z.infer<typeof GetQuestionsResponseSchema>;

export const getQuestions = (params: GetQuestionsRequestDTO) =>
  axios
    .get<GetQuestionsResponseDTO>('/api/questions', {
      params: GetQuestionsRequestSchema.parse(params),
    })
    .then((res) => GetQuestionsResponseSchema.parse(res.data));
