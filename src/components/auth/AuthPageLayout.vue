<script
  setup
  lang="ts"
>
defineSlots<{
  default: undefined;
}>();
</script>

<template>
  <div class="auth-page">
    <div class="auth-page-inner">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  padding: 48px;
  background: var(--background);
}

.auth-page-inner {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  width: 100%;
  max-width: 500px;
}
</style>
