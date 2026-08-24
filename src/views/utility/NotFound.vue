<script
  setup
  lang="ts"
>
import { ArrowLeft, FileQuestion, Home } from '@lucide/vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function goToDashboard() {
  router.push('/business/dashboard/overview');
}

function goBack() {
  router.back();
}
</script>

<template>
  <div class="page">
    <div class="icon-circle">
      <FileQuestion
        :size="48"
        color="var(--primary)"
      />
    </div>
    <h1 class="code">404</h1>
    <p class="title">This page doesn't exist</p>
    <p class="subtitle">
      The page you're looking for might have been removed,<br>
      had its name changed, or is temporarily unavailable.
    </p>
    <div class="actions">
      <button
        type="button"
        class="btn btn--primary"
        @click="goToDashboard"
      >
        <Home :size="16" />
        Go to dashboard
      </button>
      <button
        type="button"
        class="btn btn--outline"
        @click="goBack"
      >
        <ArrowLeft :size="16" />
        Go back
      </button>
    </div>
    <a
      href="#"
      class="support-link"
      @click.prevent
      >Need help? Contact support</a
    >
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  padding: 48px;
  background: var(--background);
}

.icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  background: var(--primary-tint);
  border-radius: 50%;
}

.code {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 72px;
  font-weight: 800;
  line-height: 1;
  color: var(--foreground);
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
  line-height: 1.6;
  color: var(--muted-foreground);
  text-align: center;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.btn {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 12px 24px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  border: none;
  border-radius: 999px;
  transition: all 0.15s;
}

.btn--primary {
  color: var(--primary-foreground);
  background: var(--primary);
}

.btn--primary:hover {
  background: #4639d4;
}

.btn--outline {
  color: var(--muted-foreground);
  background: var(--card);
  border: 1px solid var(--border);
}

.btn--outline:hover {
  background: var(--muted);
}

.support-link {
  margin-top: 4px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--primary);
  text-decoration: none;
}

.support-link:hover {
  text-decoration: underline;
}
</style>
