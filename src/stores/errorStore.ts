import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface AppErrorToast {
  id: number;
  message: string;
}

const TOAST_DURATION_MS = 6000;

export const useErrorStore = defineStore('error', () => {
  const toasts = ref<AppErrorToast[]>([]);
  let nextId = 1;

  function showError(message: string): number {
    const id = nextId++;
    toasts.value.push({ id, message });
    setTimeout(() => {
      removeError(id);
    }, TOAST_DURATION_MS);
    return id;
  }

  function removeError(id: number): void {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  return {
    toasts,
    showError,
    removeError,
  };
});
