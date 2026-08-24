<script
  setup
  lang="ts"
>
import { Check, UserRound } from '@lucide/vue';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuthBrand from '@/components/auth/AuthBrand.vue';
import AuthCard from '@/components/auth/AuthCard.vue';
import AuthPageLayout from '@/components/auth/AuthPageLayout.vue';
import BackButton from '@/components/auth/BackButton.vue';
import TabSwitcher from '@/components/auth/TabSwitcher.vue';
import { professionalAuth } from '@/services/auth/professionalAuthService';

const router = useRouter();
const route = useRoute();
const activeTab = computed(() => (route.query.tab as string) || 'signup');

const fullName = ref('Aziz Karimov');
const email = ref('aziz.karimov@masters.uz');
const password = ref('');
const agreedToTerms = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const tabs = [
  { label: 'Sign in', value: 'signin' },
  { label: 'Sign up', value: 'signup' },
];

const canSubmit = computed(
  () =>
    fullName.value.trim() &&
    email.value.trim() &&
    password.value.length >= 8 &&
    agreedToTerms.value,
);

function switchTab(tab: string) {
  if (tab === 'signin') {
    router.push({ name: 'professional-auth-signin', query: { tab: 'signin' } });
  }
}

function goBack() {
  router.push({ name: 'professional-auth' });
}

async function signUp() {
  if (!canSubmit.value) {
    return;
  }
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const result = await professionalAuth.signUp({
      fullName: fullName.value,
      email: email.value,
      password: password.value,
    });
    localStorage.setItem('token', result.token);
    router.push({ name: 'professional-onboarding-step1' });
  } catch {
    errorMessage.value = 'Registration failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <AuthPageLayout>
    <AuthBrand
      :icon="UserRound"
      icon-bg="var(--primary)"
      label="Professional"
    />

    <AuthCard
      width="460px"
      padding="32px"
      gap="16px"
    >
      <div class="top-row">
        <BackButton @click="goBack" />
      </div>

      <TabSwitcher
        :tabs="tabs"
        :active-tab="activeTab"
        @switch="switchTab"
      />

      <div class="header-text">
        <h1 class="title">Create your profile</h1>
        <p class="subtitle">
          Your craft, your hours — join thousands of masters earning on their
          terms.
        </p>
      </div>

      <div class="field-group">
        <label class="field-label">Full name</label>
        <input
          v-model="fullName"
          class="field-input"
          type="text"
          placeholder="Aziz Karimov"
        >
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

      <div class="field-group">
        <label class="field-label">Password</label>
        <input
          v-model="password"
          class="field-input"
          type="password"
          placeholder="At least 8 characters"
        >
      </div>

      <label class="checkbox-row">
        <div class="checkbox-custom">
          <input
            v-model="agreedToTerms"
            type="checkbox"
            class="checkbox-hidden"
          >
          <div
            class="checkbox-box"
            :class="{ checked: agreedToTerms }"
          >
            <Check
              v-if="agreedToTerms"
              :size="12"
              color="#FFFFFF"
            />
          </div>
        </div>
        <span class="checkbox-label">
          I agree to the
          <a
            class="link"
            href="#"
            >Terms of Service</a
          >
          and
          <a
            class="link"
            href="#"
            >Privacy Policy</a
          >
        </span>
      </label>

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
        @click="signUp"
      >
        {{ isLoading ? 'Creating...' : 'Create profile' }}
      </button>
    </AuthCard>
  </AuthPageLayout>
</template>

<style scoped>
.top-row {
  display: flex;
  width: 100%;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  font-size: 13px;
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

.checkbox-row {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  cursor: pointer;
}

.checkbox-custom {
  flex-shrink: 0;
}

.checkbox-hidden {
  display: none;
}

.checkbox-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 6px;
  transition: background 0.15s;
}

.checkbox-box.checked {
  background: var(--primary);
  border-color: var(--primary);
}

.checkbox-label {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--foreground);
}

.link {
  color: var(--primary);
  text-decoration: underline;
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
  background: var(--primary);
}

.error-text {
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--destructive);
  text-align: center;
}
</style>
