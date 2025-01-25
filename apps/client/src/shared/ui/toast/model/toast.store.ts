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

export const useToastStore = create<ToastStore>((set) => {
  const deactivateToast = (id: string) => {
    set((state) => ({
      toasts: state.toasts.map((t) => (t.id === id ? { ...t, isActive: false } : t)),
    }));
  };

  const removeToast = (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  };

  return {
    toasts: [],
    addToast: (toast) => {
      const id = window.crypto.randomUUID();

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
        deactivateToast(id);
        setTimeout(() => removeToast(id), 300);
      }, toast.duration);
    },
  };
});
