<script
  setup
  lang="ts"
>
import { Send } from '@lucide/vue';

defineProps<{
  isOpen: boolean;
  memberName?: string;
  memberEmail?: string;
}>();

const emit = defineEmits<{
  cancel: [];
  confirm: [];
}>();
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="resend-modal-backdrop"
      @click.self="emit('cancel')"
    >
      <div class="resend-modal">
        <!-- Icon -->
        <div class="resend-modal__icon">
          <Send :size="22" />
        </div>

        <!-- Text -->
        <div class="resend-modal__text">
          <h2 class="resend-modal__title">Resend invitation?</h2>
          <p class="resend-modal__body">
            A new invitation will be sent to
            <strong>{{ memberName || 'this member' }}</strong>
            <template v-if="memberEmail"> at {{ memberEmail }}</template>. The
            previous invite link will be invalidated.
          </p>
        </div>

        <!-- Footer -->
        <div class="resend-modal__footer">
          <button
            type="button"
            class="resend-btn resend-btn--cancel"
            @click="emit('cancel')"
          >
            Cancel
          </button>
          <button
            type="button"
            class="resend-btn resend-btn--confirm"
            @click="emit('confirm')"
          >
            <Send :size="14" />
            Resend invitation
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.resend-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.6);
}

.resend-modal {
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

.resend-modal__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  color: var(--primary-foreground);
  background: var(--primary);
  border-radius: var(--radius-pill);
}

.resend-modal__text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
}

.resend-modal__title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
}

.resend-modal__body {
  margin: 0;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--muted-foreground);
}

.resend-modal__footer {
  display: flex;
  gap: 10px;
  width: 100%;
}

.resend-btn {
  display: inline-flex;
  flex: 1;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: 11px 18px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  border: none;
  border-radius: var(--radius-pill);
  transition: opacity 0.15s;
}

.resend-btn--cancel {
  color: var(--foreground);
  background: transparent;
  border: 1px solid var(--border);
}

.resend-btn--cancel:hover {
  background: var(--accent);
}

.resend-btn--confirm {
  color: var(--primary-foreground);
  background: var(--primary);
}

.resend-btn--confirm:hover {
  opacity: 0.9;
}
</style>
