import axios from 'axios';
import { z } from 'zod';

export const GetVerifyEmailRequestSchema = z.string().email();

export const GetVerifyEmailResponseSchema = z.object({
  exists: z.boolean(),
});

export type GetVerifyEmailRequestDTO = z.infer<typeof GetVerifyEmailRequestSchema>;

export type GetVerifyEmailResponseDTO = z.infer<typeof GetVerifyEmailResponseSchema>;

export const getVerifyEmail = (email: string) =>
  axios
    .get<GetVerifyEmailResponseDTO>(`/api/users/emails/${encodeURIComponent(GetVerifyEmailRequestSchema.parse(email))}`)
    .then((res) => GetVerifyEmailResponseSchema.parse(res.data));
