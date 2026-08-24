<script
  setup
  lang="ts"
>
import { WifiOff } from '@lucide/vue';
</script>

<template>
  <div class="page">
    <WifiOff
      :size="64"
      color="var(--primary)"
    />
    <h1 class="title">No internet connection</h1>
    <p class="subtitle">Please check your connection and try again.</p>
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

.title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: var(--foreground);
}

.subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: var(--muted-foreground);
}
</style>
