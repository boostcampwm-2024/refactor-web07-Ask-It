import { create } from 'zustand';

interface AuthStore {
  userId?: number;
  accessToken?: string;
  setAuthInformation: ({ userId, accessToken }: { userId?: number; accessToken?: string }) => void;
  clearAuthInformation: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  setAuthInformation: ({ userId, accessToken }: { userId?: number; accessToken?: string }) =>
    set({ userId, accessToken }),
  clearAuthInformation: () => set({ userId: undefined, accessToken: undefined }),
}));
