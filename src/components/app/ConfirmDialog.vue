<script
  setup
  lang="ts"
>
import { AlertTriangle, Loader2, Trash2 } from '@lucide/vue';
import { computed } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: 'danger' | 'warning';
}>();

const emit = defineEmits<{
  cancel: [];
  confirm: [];
}>();

const displayConfirmLabel = computed(() => props.confirmLabel ?? 'Confirm');
const displayCancelLabel = computed(() => props.cancelLabel ?? 'Cancel');
const isDanger = computed(() => props.variant !== 'warning');
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="confirm-dialog-backdrop"
      @click.self="emit('cancel')"
    >
      <div class="confirm-dialog">
        <div
          class="confirm-dialog__icon"
          :class="isDanger ? 'confirm-dialog__icon--danger' : 'confirm-dialog__icon--warning'"
        >
          <Trash2
            v-if="isDanger"
            :size="22"
          />
          <AlertTriangle
            v-else
            :size="22"
          />
        </div>

        <div class="confirm-dialog__text">
          <h2 class="confirm-dialog__title">{{ title }}</h2>
          <p class="confirm-dialog__body">{{ message }}</p>
        </div>

        <div class="confirm-dialog__footer">
          <button
            type="button"
            class="confirm-dialog__btn confirm-dialog__btn--cancel"
            :disabled="loading"
            @click="emit('cancel')"
          >
            {{ displayCancelLabel }}
          </button>
          <button
            type="button"
            class="confirm-dialog__btn confirm-dialog__btn--confirm"
            :disabled="loading"
            @click="emit('confirm')"
          >
            <Loader2
              v-if="loading"
              :size="14"
              class="spin"
            />
            <Trash2
              v-else-if="isDanger"
              :size="14"
            />
            {{ loading ? 'Working…' : displayConfirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.confirm-dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.6);
}

.confirm-dialog {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  width: 440px;
  max-width: calc(100vw - 48px);
  padding: 24px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.24);
}

.confirm-dialog__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 999px;
}

.confirm-dialog__icon--danger {
  color: var(--destructive);
  background: var(--color-error);
}

.confirm-dialog__icon--warning {
  color: #b45309;
  background: #fef3c7;
}

.confirm-dialog__text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
}

.confirm-dialog__title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
}

.confirm-dialog__body {
  margin: 0;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--muted-foreground);
}

.confirm-dialog__footer {
  display: flex;
  gap: 10px;
  width: 100%;
}

.confirm-dialog__btn {
  display: flex;
  flex: 1;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  border-radius: 12px;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.confirm-dialog__btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.confirm-dialog__btn--cancel {
  color: var(--muted-foreground);
  background: var(--surface);
  border: 1px solid var(--border);
}

.confirm-dialog__btn--cancel:hover:not(:disabled) {
  background: var(--border);
}

.confirm-dialog__btn--confirm {
  color: #fff;
  background: var(--destructive);
}

.confirm-dialog__btn--confirm:hover:not(:disabled) {
  filter: brightness(1.05);
}
</style>
