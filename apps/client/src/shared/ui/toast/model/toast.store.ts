import { create } from 'zustand';

export type ToastType = 'SUCCESS' | 'ERROR' | 'INFO';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  isActive: boolean;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'isActive' | 'id'>) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);

    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          ...toast,
          isActive: true,
          id,
        },
      ],
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.map((t) => (t.id === id ? { ...t, isActive: false } : t)),
      }));

      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, 300);
    }, toast.duration);
  },
}));
