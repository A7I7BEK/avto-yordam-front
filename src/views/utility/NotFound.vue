<script
  setup
  lang="ts"
>
import { FileQuestion } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

function goHome() {
  router.push({ name: 'account-type' });
}
</script>

<template>
  <div class="page">
    <FileQuestion
      :size="64"
      color="#5749F4"
    />
    <h1 class="title">Page not found</h1>
    <p class="subtitle">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <button
      class="btn"
      type="button"
      @click="goHome"
    >
      Go home
    </button>
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
  background: #ffffff;
}

.title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: #2a2933;
}

.subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #616167;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  margin-top: 8px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  background: #5749f4;
  border: none;
  border-radius: 999px;
}
</style>
