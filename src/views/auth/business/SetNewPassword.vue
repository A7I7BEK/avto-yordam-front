<script
  setup
  lang="ts"
>
import { ArrowLeft, Building2, Check, Circle, Lock } from '@lucide/vue';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuthBrand from '@/components/auth/AuthBrand.vue';
import AuthCard from '@/components/auth/AuthCard.vue';
import AuthPageLayout from '@/components/auth/AuthPageLayout.vue';
import { businessAuth } from '@/services/auth/businessAuthService';

const router = useRouter();
const route = useRoute();

const resetToken = (route.query.resetToken as string) || 'mock-reset-token';
const newPassword = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const HAS_NUMBER = /\d/;
const HAS_UPPERCASE = /[A-Z]/;

const requirements = computed(() => [
  { label: 'At least 8 characters', met: newPassword.value.length >= 8 },
  { label: 'Contains a number', met: HAS_NUMBER.test(newPassword.value) },
  {
    label: 'Contains an uppercase letter',
    met: HAS_UPPERCASE.test(newPassword.value),
  },
  {
    label: 'Different from your last 3 passwords',
    met: false,
  },
]);

const allRequirementsMet = computed(() =>
  requirements.value.every((r) => r.met),
);
const passwordsMatch = computed(
  () =>
    newPassword.value === confirmPassword.value && newPassword.value.length > 0,
);
const canSubmit = computed(
  () => allRequirementsMet.value && passwordsMatch.value,
);

async function setNewPassword() {
  if (!canSubmit.value) {
    return;
  }
  isLoading.value = true;
  errorMessage.value = '';
  try {
    await businessAuth.resetPassword({
      token: resetToken,
      newPassword: newPassword.value,
    });
    router.push({
      name: 'auth-login',
      query: { type: 'business' },
    });
  } catch {
    errorMessage.value = 'Failed to reset password. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

function goBackToSignIn() {
  router.push({
    name: 'auth-login',
    query: { type: 'business' },
  });
}
</script>

<template>
  <AuthPageLayout>
    <AuthBrand
      :icon="Building2"
      icon-bg="#2A2933"
      label="Business"
    />

    <AuthCard
      width="460px"
      padding="36px"
      gap="22px"
    >
      <!-- Lock Icon -->
      <div class="icon-circle">
        <Lock
          :size="28"
          color="var(--primary)"
        />
      </div>

      <div class="header-text">
        <h1 class="title">Set a new password</h1>
        <p class="subtitle">
          Choose a strong password for admin@yourgarage.uz. This protects your
          workspace, team, and customer data.
        </p>
      </div>

      <div class="field-group">
        <label class="field-label">New password</label>
        <input
          v-model="newPassword"
          class="field-input"
          type="password"
          placeholder="Enter new password"
        >
      </div>

      <div class="field-group">
        <label class="field-label">Confirm new password</label>
        <input
          v-model="confirmPassword"
          class="field-input"
          type="password"
          placeholder="Confirm new password"
        >
      </div>

      <!-- Requirements -->
      <div class="requirements">
        <div
          v-for="req in requirements"
          :key="req.label"
          class="requirement-row"
        >
          <Check
            v-if="req.met"
            :size="14"
            color="var(--color-success-foreground)"
          />
          <Circle
            v-else
            :size="14"
            color="var(--muted-foreground)"
          />
          <span>{{ req.label }}</span>
        </div>
      </div>

      <div
        v-if="errorMessage"
        class="error-text"
      >
        {{ errorMessage }}
      </div>

      <button
        class="btn btn-primary"
        type="button"
        :disabled="!canSubmit || isLoading"
        @click="setNewPassword"
      >
        {{ isLoading ? 'Setting...' : 'Set new password' }}
      </button>

      <!-- Back to sign in -->
      <button
        class="back-link"
        type="button"
        @click="goBackToSignIn"
      >
        <ArrowLeft
          :size="14"
          color="var(--primary)"
        />
        <span>Back to sign in</span>
      </button>
    </AuthCard>
  </AuthPageLayout>
</template>

<style scoped>
.icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: var(--muted);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  text-align: center;
}

.title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: var(--foreground);
}

.subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--muted-foreground);
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.field-label {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

.field-input {
  box-sizing: border-box;
  width: 100%;
  padding: 18px 24px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--foreground);
  outline: none;
  background: var(--muted);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
}

.field-input::placeholder {
  color: var(--muted-icon);
}

.requirements {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.requirement-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.requirement-row span {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.btn {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 16px 24px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: 999px;
  transition: opacity 0.15s;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-primary {
  color: var(--primary-foreground);
  background: var(--primary);
}

.back-link {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--primary);
  cursor: pointer;
  background: none;
  border: none;
}

.back-link:hover {
  text-decoration: underline;
}

.error-text {
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--destructive);
  text-align: center;
}
</style>
