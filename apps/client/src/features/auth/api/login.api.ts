import axios from 'axios';
import { z } from 'zod';

export const PostLoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

export const PostLoginResponseSchema = z.object({
  accessToken: z.string(),
  userId: z.number(),
});

export type PostLoginRequestDTO = z.infer<typeof PostLoginRequestSchema>;

export type PostLoginResponseDTO = z.infer<typeof PostLoginResponseSchema>;

export const login = (body: PostLoginRequestDTO) =>
  axios
    .post<PostLoginResponseDTO>(`/api/auth/login`, PostLoginRequestSchema.parse(body))
    .then((res) => PostLoginResponseSchema.parse(res.data));
