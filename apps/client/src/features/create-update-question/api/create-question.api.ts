import axios from 'axios';
import { z } from 'zod';

import { QuestionSchema } from '@/entities/session';

export const PostQuestionRequestSchema = z.object({
  token: z.string(),
  sessionId: z.string(),
  body: z.string().min(1),
});

export const PostQuestionResponseSchema = z.object({
  question: QuestionSchema,
});

export type PostQuestionRequestDTO = z.infer<typeof PostQuestionRequestSchema>;

export type PostQuestionResponseDTO = z.infer<typeof PostQuestionResponseSchema>;

export const postQuestion = (body: PostQuestionRequestDTO) =>
  axios
    .post<PostQuestionResponseDTO>('/api/questions', PostQuestionRequestSchema.parse(body))
    .then((res) => PostQuestionResponseSchema.parse(res.data));
