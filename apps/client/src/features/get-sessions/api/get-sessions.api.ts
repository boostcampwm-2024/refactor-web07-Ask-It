import axios from 'axios';
import { z } from 'zod';

export const GetSessionsResponseSchema = z.object({
  sessionData: z.array(
    z.object({
      sessionId: z.string(),
      title: z.string(),
      createdAt: z.object({
        year: z.number(),
        month: z.number(),
        date: z.number(),
      }),
      expired: z.boolean(),
    }),
  ),
});

export type GetSessionsResponseDTO = z.infer<typeof GetSessionsResponseSchema>;

export const getSessions = () =>
  axios.get<GetSessionsResponseDTO>('/api/sessions').then((res) => GetSessionsResponseSchema.parse(res.data));
