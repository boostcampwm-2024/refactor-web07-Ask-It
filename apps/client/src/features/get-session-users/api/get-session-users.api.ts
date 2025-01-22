import axios from 'axios';
import { z } from 'zod';

import { UserSchema } from '@/entities/session';

export const GetSessionUsersRequestSchema = z.object({
  token: z.string(),
  sessionId: z.string(),
});

export const GetSessionUsersResponseSchema = z.object({
  users: z.array(UserSchema),
});

export type GetSessionUsersRequestDTO = z.infer<typeof GetSessionUsersRequestSchema>;

export type GetSessionUsersResponseDTO = z.infer<typeof GetSessionUsersResponseSchema>;

export const getSessionUsers = (params: GetSessionUsersRequestDTO) =>
  axios
    .get<GetSessionUsersResponseDTO>('/api/sessions-auth/users', {
      params: GetSessionUsersRequestSchema.parse(params),
    })
    .then((res) => GetSessionUsersResponseSchema.parse(res.data));
