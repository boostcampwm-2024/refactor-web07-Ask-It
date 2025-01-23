import axios from 'axios';
import { z } from 'zod';

export const PostTokenRefreshResponseSchema = z.object({
  accessToken: z.string(),
  userId: z.number(),
});

export type PostTokenRefreshResponseDTO = z.infer<typeof PostTokenRefreshResponseSchema>;

export const tokenRefresh = () =>
  axios
    .post<PostTokenRefreshResponseDTO>(`/api/auth/token`, undefined, {
      withCredentials: true,
    })
    .then((res) => PostTokenRefreshResponseSchema.parse(res.data));
