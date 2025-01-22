import axios from 'axios';
import { z } from 'zod';

// TODO: refresh -> tokenRefresh

export const PostRefreshResponseSchema = z.object({
  accessToken: z.string(),
  userId: z.number(),
});

export type PostRefreshResponseDTO = z.infer<typeof PostRefreshResponseSchema>;

export const refresh = () =>
  axios
    .post<PostRefreshResponseDTO>(`/api/auth/token`, undefined, {
      withCredentials: true,
    })
    .then((res) => PostRefreshResponseSchema.parse(res.data));
