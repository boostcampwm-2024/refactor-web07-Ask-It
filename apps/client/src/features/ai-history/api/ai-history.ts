import axios from 'axios';
import { z } from 'zod';

export const AIRequestTypeSchema = z.enum(['IMPROVE_QUESTION']);

export const AIResultTypeSchema = z.enum(['ACCEPT', 'REJECT']);

export const PostAIHistoryRequestSchema = z.object({
  promptName: AIRequestTypeSchema,
  request: z.string(),
  response: z.string(),
  result: AIResultTypeSchema,
});

export type AIRequestType = z.infer<typeof AIRequestTypeSchema>;

export type AIResultType = z.infer<typeof AIResultTypeSchema>;

export type PostAIHistoryRequestDTO = z.infer<typeof PostAIHistoryRequestSchema>;

export const postAIHistory = (body: PostAIHistoryRequestDTO) =>
  axios.post('/api/ai/history', PostAIHistoryRequestSchema.parse(body)).then((res) => res.data);
