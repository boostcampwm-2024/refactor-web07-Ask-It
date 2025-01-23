import axios from 'axios';
import { z } from 'zod';

export const GetVerifyNicknameRequestSchema = z.string().min(3).max(20);

export const GetVerifyNicknameResponseSchema = z.object({ exists: z.boolean() });

export type GetVerifyNicknameRequestDTO = z.infer<typeof GetVerifyNicknameRequestSchema>;

export type GetVerifyNicknameResponseDTO = z.infer<typeof GetVerifyNicknameResponseSchema>;

export const getVerifyNickname = (nickname: string) =>
  axios
    .get<GetVerifyNicknameResponseDTO>(
      `/api/users/nicknames/${encodeURIComponent(GetVerifyNicknameRequestSchema.parse(nickname))}`,
    )
    .then((res) => GetVerifyNicknameResponseSchema.parse(res.data));
