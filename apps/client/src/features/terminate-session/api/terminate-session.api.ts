import axios from 'axios';
import { z } from 'zod';

export const PostSessionTerminateRequestSchema = z.object({
  token: z.string(),
});

export const PostSessionTerminateResponseSchema = z.object({
  expired: z.boolean(),
});

export type PostSessionTerminateRequestDTO = z.infer<typeof PostSessionTerminateRequestSchema>;

export type PostSessionTerminateResponseDTO = z.infer<typeof PostSessionTerminateResponseSchema>;

export const postSessionTerminate = ({ token, sessionId }: PostSessionTerminateRequestDTO & { sessionId: string }) =>
  axios
    .post(`/api/sessions/${sessionId}/terminate`, PostSessionTerminateRequestSchema.parse({ token }))
    .then((res) => PostSessionTerminateResponseSchema.parse(res.data));
