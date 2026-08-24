<script
  setup
  lang="ts"
>
import { X } from '@lucide/vue';
import { useErrorStore } from '@/stores/errorStore';

const errorStore = useErrorStore();
</script>

<template>
  <Teleport to="body">
    <div
      class="error-toasts"
      aria-live="assertive"
    >
      <TransitionGroup name="toast">
        <div
          v-for="toast in errorStore.toasts"
          :key="toast.id"
          class="error-toast"
        >
          <span class="error-toast__message">{{ toast.message }}</span>
          <button
            type="button"
            class="error-toast__close"
            :aria-label="'Dismiss'"
            @click="errorStore.removeError(toast.id)"
          >
            <X :size="14" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.error-toasts {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 360px;
}

.error-toast {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px 14px;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.4;
  color: var(--foreground);
  background: var(--card);
  border: 1px solid rgba(204, 51, 20, 0.35);
  border-left: 3px solid var(--destructive);
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.error-toast__message {
  flex: 1;
  word-break: break-word;
}

.error-toast__close {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 2px;
  color: var(--muted-foreground);
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 4px;
}

.error-toast__close:hover {
  color: var(--foreground);
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(16px);
}
</style>
