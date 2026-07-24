<script
  setup
  lang="ts"
>
import {
  ChevronRight,
  Info,
  Mail,
  Phone,
  Send,
  UserPlus,
  X,
} from '@lucide/vue';
import { onMounted, ref, watch } from 'vue';
import { getRoles } from '@/services/rolesService';

const props = defineProps<{
  isOpen: boolean;
  orgName?: string;
}>();

const emit = defineEmits<{
  close: [];
  send: [
    data: {
      contactMethod: 'phone' | 'email';
      phone: string;
      email: string;
      role: string;
      message: string;
    },
  ];
}>();

const roleOptions = ref<{ id: string; name: string }[]>([]);

const contactMethod = ref<'phone' | 'email'>('phone');
const phone = ref('90 245-12-09');
const email = ref('');
const role = ref('');
const message = ref(
  "Hi! We'd like you to join AutoFix MCHJ as a master. Your specialties match what we need on the floor right now.",
);

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      contactMethod.value = 'phone';
      phone.value = '90 245-12-09';
      email.value = '';
      role.value = roleOptions.value[0]?.name ?? '';
      message.value =
        "Hi! We'd like you to join AutoFix MCHJ as a master. Your specialties match what we need on the floor right now.";
    }
  },
);

onMounted(async () => {
  try {
    const data = await getRoles();
    roleOptions.value = data.map((r) => ({ id: r.name, name: r.name }));
    role.value = roleOptions.value[0]?.name ?? '';
  } catch {
    // keep empty
  }
});

function handleClose() {
  emit('close');
}

function handleSend() {
  emit('send', {
    contactMethod: contactMethod.value,
    phone: phone.value,
    email: email.value,
    role: role.value,
    message: message.value,
  });
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="invite-modal-backdrop"
      @click.self="handleClose"
    >
      <div class="invite-modal">
        <!-- Header -->
        <div class="invite-modal__header">
          <div class="invite-modal__header-left">
            <div class="invite-modal__icon-circle">
              <UserPlus :size="18" />
            </div>
            <div class="invite-modal__title-group">
              <h2 class="invite-modal__title">Invite team member</h2>
              <p class="invite-modal__subtitle">
                {{ orgName || 'Organization' }}
                · Workspace invitation
              </p>
            </div>
          </div>
          <button
            type="button"
            class="invite-modal__close"
            @click="handleClose"
          >
            <X :size="16" />
          </button>
        </div>

        <!-- Body -->
        <div class="invite-modal__body">
          <!-- Contact method -->
          <div class="invite-field">
            <label class="invite-label">Contact method</label>
            <div class="invite-segment">
              <button
                type="button"
                class="invite-segment__btn"
                :class="{ 'invite-segment__btn--active': contactMethod === 'phone' }"
                @click="contactMethod = 'phone'"
              >
                <Phone :size="13" />
                Phone
              </button>
              <button
                type="button"
                class="invite-segment__btn"
                :class="{ 'invite-segment__btn--active': contactMethod === 'email' }"
                @click="contactMethod = 'email'"
              >
                <Mail :size="13" />
                Email
              </button>
            </div>
          </div>

          <!-- Phone number -->
          <div
            v-if="contactMethod === 'phone'"
            class="invite-field"
          >
            <label class="invite-label">Phone number</label>
            <div class="invite-phone-input">
              <span class="invite-phone-input__code">+998</span>
              <input
                v-model="phone"
                type="text"
                class="invite-phone-input__field"
              >
            </div>
          </div>

          <!-- Email address -->
          <div
            v-if="contactMethod === 'email'"
            class="invite-field"
          >
            <label class="invite-label">Email address</label>
            <input
              v-model="email"
              type="email"
              class="invite-email-input"
              placeholder="member@example.com"
            >
          </div>

          <!-- Role -->
          <div class="invite-field">
            <label class="invite-label">Role</label>
            <div class="invite-select">
              <select
                v-model="role"
                class="invite-select__native"
              >
                <option
                  v-for="opt in roleOptions"
                  :key="opt.id"
                  :value="opt.name"
                >
                  {{ opt.name }}
                </option>
              </select>
              <span class="invite-select__text"
                >{{ role || 'Select role' }}</span
              >
              <ChevronRight
                :size="14"
                class="invite-select__chevron"
              />
            </div>
          </div>

          <!-- Welcome message -->
          <div class="invite-field">
            <label class="invite-label">Welcome message (optional)</label>
            <textarea
              v-model="message"
              class="invite-textarea"
              rows="3"
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="invite-modal__footer">
          <div class="invite-modal__footer-info">
            <Info :size="13" />
            <span>Invitation expires in 7 days</span>
          </div>
          <div class="invite-modal__footer-actions">
            <button
              type="button"
              class="invite-btn invite-btn--cancel"
              @click="handleClose"
            >
              Cancel
            </button>
            <button
              type="button"
              class="invite-btn invite-btn--send"
              @click="handleSend"
            >
              <Send :size="13" />
              Send invitation
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* ============================================
   Invite Modal
   ============================================ */
.invite-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.6);
}

.invite-modal {
  width: 632px;
  max-width: calc(100vw - 64px);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.24);
}

/* ── Header ── */
.invite-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px 24px 12px;
}

.invite-modal__header-left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.invite-modal__icon-circle {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--primary-foreground);
  background: var(--primary);
  border-radius: 12px;
}

.invite-modal__title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.invite-modal__title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
}

.invite-modal__subtitle {
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.invite-modal__close {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: var(--foreground);
  cursor: pointer;
  background: var(--accent);
  border: none;
  border-radius: var(--radius-pill);
  transition: background 0.15s;
}

.invite-modal__close:hover {
  background: var(--muted);
}

/* ── Body ── */
.invite-modal__body {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 8px 24px 24px;
}

.invite-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.invite-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
}

/* ── Segmented control ── */
.invite-segment {
  display: flex;
  gap: 0;
  padding: 4px;
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
}

.invite-segment__btn {
  display: inline-flex;
  flex: 1;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-foreground);
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: var(--radius-pill);
  transition:
    background 0.15s,
    color 0.15s,
    box-shadow 0.15s;
}

.invite-segment__btn--active {
  font-weight: 600;
  color: var(--foreground);
  background: var(--background);
  box-shadow: 0 1px 3.5px rgba(0, 0, 0, 0.06);
}

/* ── Phone input ── */
.invite-phone-input {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 0 16px;
  background: var(--background);
  border: 1.5px solid var(--input);
  border-radius: var(--radius-pill);
}

.invite-phone-input__code {
  padding: 2px 8px 2px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
  border-right: 1px solid var(--border);
}

.invite-phone-input__field {
  flex: 1;
  min-width: 0;
  height: 42px;
  padding: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  outline: none;
  background: transparent;
  border: none;
}

/* ── Email input ── */
.invite-email-input {
  width: 100%;
  height: 44px;
  padding: 0 16px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  outline: none;
  background: var(--background);
  border: 1.5px solid var(--input);
  border-radius: var(--radius-pill);
}

.invite-email-input::placeholder {
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ── Role select ── */
.invite-select {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  background: var(--background);
  border: 1.5px solid var(--input);
  border-radius: var(--radius-pill);
}

.invite-select__native {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 42px;
  padding: 0 16px;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  outline: none;
  background: transparent;
  border: none;
  opacity: 0;
}

.invite-select__text {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

.invite-select__chevron {
  flex-shrink: 0;
  color: var(--muted-foreground);
  transform: rotate(90deg);
}

/* ── Textarea ── */
.invite-textarea {
  width: 100%;
  height: 90px;
  padding: 14px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--foreground);
  resize: none;
  outline: none;
  background: var(--background);
  border: 1.5px solid var(--input);
  border-radius: 14px;
}

.invite-textarea::placeholder {
  color: var(--muted-foreground);
}

/* ── Footer ── */
.invite-modal__footer {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px 24px;
  border-top: 1px solid var(--border);
}

.invite-modal__footer-info {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.invite-modal__footer-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.invite-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  border: none;
  border-radius: var(--radius-pill);
  transition: opacity 0.15s;
}

.invite-btn--cancel {
  color: var(--foreground);
  background: transparent;
  border: 1px solid var(--border);
}

.invite-btn--cancel:hover {
  background: var(--accent);
}

.invite-btn--send {
  gap: 6px;
  font-weight: 600;
  color: var(--primary-foreground);
  background: var(--primary);
}

.invite-btn--send:hover {
  opacity: 0.9;
}
</style>
