import axios from 'axios';
import { z } from 'zod';

import { UserSchema } from '@/entities/session';

export const PatchSessionHostRequestSchema = z.object({
  token: z.string(),
  sessionId: z.string(),
  isHost: z.boolean(),
});

export const PatchSessionHostResponseSchema = z.object({
  user: UserSchema,
});

export type PatchSessionHostRequestDTO = z.infer<typeof PatchSessionHostRequestSchema>;

export type PatchSessionHostResponseDTO = z.infer<typeof PatchSessionHostResponseSchema>;

export const patchSessionHost = (userId: number, body: PatchSessionHostRequestDTO) =>
  axios
    .patch<PatchSessionHostResponseDTO>(`/api/sessions-auth/host/${userId}`, PatchSessionHostRequestSchema.parse(body))
    .then((res) => PatchSessionHostResponseSchema.parse(res.data));
