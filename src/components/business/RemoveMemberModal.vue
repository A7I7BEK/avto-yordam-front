<script
  setup
  lang="ts"
>
import { Trash2, UserMinus } from '@lucide/vue';
import { computed } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  memberName?: string;
  orgName?: string;
}>();

const emit = defineEmits<{
  cancel: [];
  confirm: [];
}>();

const displayOrg = computed(() => props.orgName || 'the organization');
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="remove-modal-backdrop"
      @click.self="emit('cancel')"
    >
      <div class="remove-modal">
        <!-- Icon -->
        <div class="remove-modal__icon">
          <UserMinus :size="22" />
        </div>

        <!-- Text -->
        <div class="remove-modal__text">
          <h2 class="remove-modal__title">Remove team member?</h2>
          <p class="remove-modal__body">
            {{ memberName || 'This member' }}
            will lose access to the
            {{ displayOrg }}
            workspace and be unassigned from all active bookings. This action
            can't be undone.
          </p>
        </div>

        <!-- Footer -->
        <div class="remove-modal__footer">
          <button
            type="button"
            class="remove-btn remove-btn--cancel"
            @click="emit('cancel')"
          >
            Cancel
          </button>
          <button
            type="button"
            class="remove-btn remove-btn--confirm"
            @click="emit('confirm')"
          >
            <Trash2 :size="14" />
            Remove member
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* ============================================
   Remove Member Modal
   ============================================ */
.remove-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.6);
}

.remove-modal {
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

/* ── Icon ── */
.remove-modal__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  color: var(--destructive);
  background: var(--color-error);
  border-radius: var(--radius-pill);
}

/* ── Text ── */
.remove-modal__text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
}

.remove-modal__title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
}

.remove-modal__body {
  margin: 0;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--muted-foreground);
}

/* ── Footer ── */
.remove-modal__footer {
  display: flex;
  gap: 10px;
  width: 100%;
}

.remove-btn {
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

.remove-btn--cancel {
  color: var(--foreground);
  background: transparent;
  border: 1px solid var(--border);
}

.remove-btn--cancel:hover {
  background: var(--accent);
}

.remove-btn--confirm {
  color: var(--destructive-foreground);
  background: var(--destructive);
}

.remove-btn--confirm:hover {
  opacity: 0.9;
}
</style>
