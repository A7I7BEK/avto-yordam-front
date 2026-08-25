<script
  setup
  lang="ts"
>
import { ArrowLeft, KeyRound, Mail } from '@lucide/vue';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuthBrand from '@/components/auth/AuthBrand.vue';
import AuthCard from '@/components/auth/AuthCard.vue';
import AuthPageLayout from '@/components/auth/AuthPageLayout.vue';
import { professionalAuth } from '@/services/auth/professionalAuthService';

const router = useRouter();
const route = useRoute();

const email = ref((route.query.email as string) || '');
const isLoading = ref(false);
const errorMessage = ref('');

async function sendResetLink() {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const result = await professionalAuth.forgotPassword({
      email: email.value,
    });
    router.push({
      name: 'auth-reset-password',
      query: { resetToken: result.resetToken },
    });
  } catch {
    errorMessage.value = 'Failed to send reset link. Try again.';
  } finally {
    isLoading.value = false;
  }
}

function goBackToSignIn() {
  router.push({ name: 'auth-login', query: { type: route.query.type } });
}
</script>

<template>
  <AuthPageLayout>
    <AuthBrand />

    <AuthCard
      width="460px"
      padding="40px"
      gap="24px"
    >
      <div class="icon-circle">
        <KeyRound
          :size="28"
          color="var(--primary)"
        />
      </div>

      <div class="header-text">
        <h1 class="title">Forgot your password?</h1>
        <p class="subtitle">
          Happens to the best of us. Enter your email and we'll send a reset
          link.
        </p>
      </div>

      <div class="field-group">
        <label class="field-label">Email</label>
        <input
          v-model="email"
          class="field-input"
          type="email"
          placeholder="aziz.karimov@masters.uz"
        >
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
        :disabled="isLoading"
        @click="sendResetLink"
      >
        {{ isLoading ? 'Sending...' : 'Send reset link' }}
      </button>

      <div class="hint-box">
        <Mail
          :size="14"
          color="var(--muted-foreground)"
        />
        <span>
          Check your spam folder if you don't see it within a minute.
        </span>
      </div>

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
  padding: 16px 20px;
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

.btn {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 15px 20px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: 999px;
  transition: opacity 0.15s;
}

.btn:hover {
  opacity: 0.9;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-primary {
  color: var(--primary-foreground);
  background: var(--primary);
}

.error-text {
  width: 100%;
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--destructive);
  text-align: center;
  background: var(--color-error);
  border-radius: 12px;
}

.hint-box {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  color: var(--muted-foreground);
  background: var(--muted);
  border-radius: 12px;
}

.back-link {
  display: flex;
  gap: 6px;
  align-items: center;
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
  opacity: 0.8;
}
</style>
