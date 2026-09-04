<script
  setup
  lang="ts"
>
import { Building2, UserRound } from '@lucide/vue';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const invitationId = computed(() => String(route.params.invitationId ?? ''));

onMounted(() => {
  // Already signed in → let them find/accept the invitation in their inbox.
  if (localStorage.getItem('token')) {
    router.replace('/professional/invitations');
  }
});

function goToSignIn() {
  router.push('/auth/login');
}

function goToRegister() {
  router.push('/auth/register');
}
</script>

<template>
  <div class="invite-page">
    <div class="invite-card">
      <div class="invite-card__brand">
        <Building2
          :size="18"
          color="white"
        />
        <span>Avto Yordam</span>
      </div>

      <div class="invite-card__icon">
        <UserRound :size="26" />
      </div>

      <h1 class="invite-card__title">
        You've been invited to join a workspace
      </h1>
      <p class="invite-card__body">
        A team wants you to join them on Avto Yordam. Sign in to view and accept
        your invitation.
      </p>

      <div class="invite-card__actions">
        <button
          type="button"
          class="btn btn--primary"
          @click="goToSignIn"
        >
          Sign in
        </button>
        <button
          type="button"
          class="btn btn--outline"
          @click="goToRegister"
        >
          Create account
        </button>
      </div>

      <p class="invite-card__meta">
        Invitation #{{ invitationId.slice(0, 8) }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.invite-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background: var(--background, #f7f7f8);
}

.invite-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
  width: 440px;
  max-width: 100%;
  padding: 32px 28px;
  text-align: center;
  background: var(--card, #fff);
  border: 1px solid var(--border, #e6e6e9);
  border-radius: 20px;
  box-shadow: 0 20px 50px -30px rgba(15, 23, 42, 0.35);
}

.invite-card__brand {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 7px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: #5749f4;
  border-radius: 999px;
}

.invite-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  color: #5749f4;
  background: rgba(87, 73, 244, 0.12);
  border-radius: 50%;
}

.invite-card__title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--foreground, #1f2027);
}

.invite-card__body {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--muted-foreground, #6b6c74);
}

.invite-card__actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 6px;
}

.invite-card__actions .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 11px 22px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 999px;
}

.btn--primary {
  color: #fff;
  background: #5749f4;
  border: 1px solid #5749f4;
}

.btn--outline {
  color: var(--foreground, #1f2027);
  background: transparent;
  border: 1px solid var(--border, #d8d8dd);
}

.invite-card__meta {
  margin: 4px 0 0;
  font-family: Inter, sans-serif;
  font-size: 11px;
  color: var(--muted-foreground, #a0a1a8);
}
</style>
