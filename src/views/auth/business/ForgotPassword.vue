<script
  setup
  lang="ts"
>
import { ArrowLeft, Building2, KeyRound, Mail } from '@lucide/vue';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuthBrand from '@/components/auth/AuthBrand.vue';
import AuthCard from '@/components/auth/AuthCard.vue';
import AuthPageLayout from '@/components/auth/AuthPageLayout.vue';
import { businessAuth } from '@/services/auth/businessAuthService';

const router = useRouter();
const route = useRoute();

const email = ref((route.query.email as string) || 'admin@yourgarage.uz');
const isLoading = ref(false);
const errorMessage = ref('');

async function sendResetLink() {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const result = await businessAuth.forgotPassword({
      email: email.value,
    });
    router.push({
      name: 'business-auth-reset',
      query: { resetToken: result.resetToken },
    });
  } catch {
    errorMessage.value = 'Failed to send reset link. Try again.';
  } finally {
    isLoading.value = false;
  }
}

function goBackToSignIn() {
  router.push({
    name: 'business-auth-signin',
    query: { tab: 'signin' },
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
      padding="40px"
      gap="24px"
    >
      <!-- Key Icon -->
      <div class="icon-circle">
        <KeyRound
          :size="28"
          color="#5749F4"
        />
      </div>

      <div class="header-text">
        <h1 class="title">Reset your workspace password</h1>
        <p class="subtitle">
          Enter your admin email and we'll send a reset link to recover access
          to your workspace.
        </p>
      </div>

      <div class="field-group">
        <label class="field-label">Email</label>
        <input
          v-model="email"
          class="field-input"
          type="email"
          placeholder="admin@yourgarage.uz"
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

      <!-- Hint Box -->
      <div class="hint-box">
        <Mail
          :size="14"
          color="#616167"
        />
        <span>
          Check your spam folder if you don't see it within a minute.
        </span>
      </div>

      <!-- Back to sign in -->
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

.hint-box {
  box-sizing: border-box;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px 16px;
  background: #f5f5f5;
  border-radius: 24px;
}

.hint-box span {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #616167;
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
