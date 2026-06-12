<script
  setup
  lang="ts"
>
import { ArrowLeft, Check, Circle, Lock, UserRound } from '@lucide/vue';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuthBrand from '@/components/auth/AuthBrand.vue';
import AuthCard from '@/components/auth/AuthCard.vue';
import AuthPageLayout from '@/components/auth/AuthPageLayout.vue';
import { professionalAuth } from '@/services/auth/professionalAuthService';

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
    await professionalAuth.resetPassword({
      token: resetToken,
      newPassword: newPassword.value,
    });
    router.push({
      name: 'professional-auth-signin',
      query: { tab: 'signin' },
    });
  } catch {
    errorMessage.value = 'Failed to reset password. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

function goBackToSignIn() {
  router.push({
    name: 'professional-auth-signin',
    query: { tab: 'signin' },
  });
}
</script>

<template>
  <AuthPageLayout>
    <AuthBrand
      :icon="UserRound"
      icon-bg="#5749F4"
      label="Professional"
    />

    <AuthCard
      width="460px"
      padding="36px"
      gap="22px"
    >
      <div class="icon-circle">
        <Lock
          :size="28"
          color="#5749F4"
        />
      </div>

      <div class="header-text">
        <h1 class="title">Set a new password</h1>
        <p class="subtitle">
          Choose a strong password to keep your master profile and earnings
          safe.
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

      <div class="requirements">
        <div
          v-for="req in requirements"
          :key="req.label"
          class="requirement-row"
        >
          <Check
            v-if="req.met"
            :size="14"
            color="#003300"
          />
          <Circle
            v-else
            :size="14"
            color="#616167"
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

      <button
        class="back-link"
        type="button"
        @click="goBackToSignIn"
      >
        <ArrowLeft
          :size="14"
          color="#5749F4"
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
  background: #f5f5f5;
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
  color: #2a2933;
}

.subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: #616167;
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
  color: #2a2933;
}

.field-input {
  box-sizing: border-box;
  width: 100%;
  padding: 18px 24px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #2a2933;
  outline: none;
  background: #f5f5f5;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.field-input::placeholder {
  color: #939399;
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
  color: #616167;
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
  color: #ffffff;
  background: #5749f4;
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
  color: #5749f4;
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
  color: #cc3314;
  text-align: center;
}
</style>
