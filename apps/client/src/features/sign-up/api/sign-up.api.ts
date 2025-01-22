import axios from 'axios';
import { z } from 'zod';

export const PostUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
  nickname: z.string().min(3).max(20),
});

export type PostUserDTO = z.infer<typeof PostUserSchema>;

export const postUser = (body: PostUserDTO) => axios.post('/api/users', PostUserSchema.parse(body));
