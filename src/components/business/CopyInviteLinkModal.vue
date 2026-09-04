<script
  setup
  lang="ts"
>
import { Check, Copy, Link } from '@lucide/vue';
import { ref } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  memberName?: string;
  /** Real, per-invitation share link (e.g. /invite/{invitationId}). */
  inviteLink: string;
}>();

const emit = defineEmits<{
  cancel: [];
}>();

const copied = ref(false);

function selectAllText(event: FocusEvent) {
  (event.target as HTMLInputElement).select();
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.inviteLink);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    // Fallback for older browsers
    const input = document.createElement('input');
    input.value = props.inviteLink;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="copy-modal-backdrop"
      @click.self="emit('cancel')"
    >
      <div class="copy-modal">
        <!-- Icon -->
        <div class="copy-modal__icon">
          <Link :size="22" />
        </div>

        <!-- Text -->
        <div class="copy-modal__text">
          <h2 class="copy-modal__title">Invite link</h2>
          <p class="copy-modal__body">
            Share this link with
            <strong>{{ memberName || 'the member' }}</strong>
            to join the workspace. The link is valid for 7 days.
          </p>
        </div>

        <!-- Link input + copy -->
        <div class="copy-modal__link-row">
          <input
            type="text"
            class="copy-modal__link-input"
            :value="inviteLink"
            readonly
            @focus="selectAllText"
          >
          <button
            type="button"
            class="copy-btn"
            :class="{ 'copy-btn--copied': copied }"
            @click="copyLink"
          >
            <Check
              v-if="copied"
              :size="14"
            />
            <Copy
              v-else
              :size="14"
            />
            {{ copied ? 'Copied' : 'Copy link' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.copy-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.6);
}

.copy-modal {
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

.copy-modal__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  color: var(--primary-foreground);
  background: var(--primary);
  border-radius: var(--radius-pill);
}

.copy-modal__text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
}

.copy-modal__title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
}

.copy-modal__body {
  margin: 0;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--muted-foreground);
}

.copy-modal__link-row {
  display: flex;
  gap: 8px;
  width: 100%;
}

.copy-modal__link-input {
  flex: 1;
  min-width: 0;
  padding: 11px 14px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 400;
  color: var(--foreground);
  outline: none;
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
}

.copy-btn {
  display: inline-flex;
  flex-shrink: 0;
  gap: 6px;
  align-items: center;
  padding: 11px 18px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-foreground);
  white-space: nowrap;
  cursor: pointer;
  background: var(--primary);
  border: none;
  border-radius: var(--radius-pill);
  transition: opacity 0.15s;
}

.copy-btn--copied {
  color: var(--color-success-foreground);
  background: var(--color-success);
}

.copy-btn:hover {
  opacity: 0.9;
}

.copy-close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 11px 18px;
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
  white-space: nowrap;
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  transition: background 0.15s;
}

.copy-close-btn:hover {
  background: var(--accent);
}
</style>
