import axios from 'axios';
import { z } from 'zod';

export const GetSessionTokenResponseSchema = z.object({
  token: z.string(),
});

export type GetSessionTokenResponseDTO = z.infer<typeof GetSessionTokenResponseSchema>;

export const getSessionToken = (sessionId: string) => {
  const tokens = JSON.parse(localStorage.getItem('sessionTokens') ?? '{}') as Record<string, string>;

  const token = tokens[sessionId];

  return axios
    .get<GetSessionTokenResponseDTO>(`/api/sessions-auth`, {
      params: {
        sessionId,
        token,
      },
    })
    .then((res) => GetSessionTokenResponseSchema.parse(res.data))
    .then((data) => {
      localStorage.setItem('sessionTokens', JSON.stringify({ ...tokens, [sessionId]: data.token }));
      return data;
    });
};
