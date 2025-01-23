import axios from 'axios';
import { z } from 'zod';

export const PostSessionRequestSchema = z.object({
  title: z.string().min(1),
});

export const PostSessionResponseSchema = z.object({
  sessionId: z.string(),
});

export type PostSessionRequestDTO = z.infer<typeof PostSessionRequestSchema>;

export type PostSessionResponseDTO = z.infer<typeof PostSessionResponseSchema>;

export const postSession = (body: PostSessionRequestDTO) =>
  axios
    .post<PostSessionResponseDTO>('/api/sessions', PostSessionRequestSchema.parse(body))
    .then((res) => PostSessionResponseSchema.parse(res.data));
