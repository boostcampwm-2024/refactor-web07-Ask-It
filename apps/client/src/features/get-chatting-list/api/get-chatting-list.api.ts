import axios from 'axios';
import { z } from 'zod';

import { ChatSchema } from '@/entities/session';

export const GetChattingListResponseSchema = z.object({
  chats: z.array(ChatSchema),
});

export type GetChattingListResponseDTO = z.infer<typeof GetChattingListResponseSchema>;

export const getChattingList = (token: string, sessionId: string, chatId?: number) =>
  axios
    .get<GetChattingListResponseDTO>(`/api/chats${chatId ? `/${chatId}` : ''}`, { params: { token, sessionId } })
    .then((res) => GetChattingListResponseSchema.parse(res.data));
