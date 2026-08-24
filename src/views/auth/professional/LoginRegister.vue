<script
  setup
  lang="ts"
>
import { ArrowLeft, Mail, Phone } from '@lucide/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthBrand from '@/components/auth/AuthBrand.vue';
import AuthCard from '@/components/auth/AuthCard.vue';
import AuthPageLayout from '@/components/auth/AuthPageLayout.vue';
import BackButton from '@/components/auth/BackButton.vue';

const router = useRouter();
const stubMessage = ref('');

function goBack() {
  router.push({ name: 'account-type' });
}

function goToPhone() {
  router.push({ name: 'professional-auth-phone' });
}

function goToEmail() {
  router.push({ name: 'professional-auth-signin', query: { tab: 'signin' } });
}

function handleGoogleLogin() {
  stubMessage.value = 'Google login coming soon';
}

function handleAppleLogin() {
  stubMessage.value = 'Apple login coming soon';
}

function switchToOrganization() {
  router.push({ name: 'business-auth' });
}
</script>

<template>
  <AuthPageLayout>
    <AuthBrand />

    <AuthCard
      width="460px"
      padding="36px"
      gap="22px"
    >
      <BackButton @click="goBack" />

      <div
        v-if="stubMessage"
        class="stub-message"
      >
        {{ stubMessage }}
      </div>

      <div class="header-text">
        <h1 class="title">Welcome to Professional</h1>
        <p class="subtitle">Your craft, your hours — start earning today</p>
      </div>

      <button
        class="btn btn-primary"
        type="button"
        @click="goToPhone"
      >
        <Phone :size="20" />
        Continue with phone
      </button>

      <button
        class="btn btn-secondary"
        type="button"
        @click="goToEmail"
      >
        <Mail :size="20" />
        Continue with email
      </button>

      <div class="or-divider">
        <div class="line" />
        <span>or</span>
        <div class="line" />
      </div>

      <div class="social-row">
        <button
          class="btn btn-social"
          type="button"
          @click="handleGoogleLogin"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </button>
        <button
          class="btn btn-social"
          type="button"
          @click="handleAppleLogin"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.61 6.24.52 7.44-.62 1.64-1.42 3.26-2.57 4.77zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
              fill="#2A2933"
            />
          </svg>
          Apple
        </button>
      </div>

      <div class="switch-row">
        <span class="switch-text">Are you an organization?</span>
        <button
          class="switch-link"
          type="button"
          @click="switchToOrganization"
        >
          Switch to Organization
        </button>
      </div>
    </AuthCard>
  </AuthPageLayout>
</template>

<style scoped>
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
  font-size: 24px;
  font-weight: 600;
  color: var(--foreground);
}

.subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
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

.btn:hover {
  opacity: 0.9;
}

.btn-primary {
  color: #ffffff;
  background: var(--primary);
}

.btn-secondary {
  color: var(--foreground);
  background: var(--border);
}

.or-divider {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
}

.or-divider .line {
  flex: 1;
  height: 1px;
  background: var(--border-soft);
}

.or-divider span {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.social-row {
  display: flex;
  gap: 10px;
  width: 100%;
}

.btn-social {
  flex: 1;
  padding: 14px 16px;
  color: var(--foreground);
  background: var(--card);
  border: 1px solid var(--border-soft);
}

.switch-row {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
}

.switch-text {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.switch-link {
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--primary);
  cursor: pointer;
  background: none;
  border: none;
}

.switch-link:hover {
  text-decoration: underline;
}

.stub-message {
  width: 100%;
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--muted-foreground);
  text-align: center;
  background: var(--muted);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
}
</style>
