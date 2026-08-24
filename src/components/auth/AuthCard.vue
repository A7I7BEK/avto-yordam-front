<script
  setup
  lang="ts"
>
defineProps<{
  width?: string;
  padding?: string;
  gap?: string;
}>();

defineSlots<{
  default: undefined;
}>();
</script>

<template>
  <div
    class="auth-card"
    :style="{
      maxWidth: width || '460px',
      padding: padding || '36px',
      gap: gap || '22px',
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.auth-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 40px;
  box-shadow: 0 10px 8.75px rgba(0, 0, 0, 0.039);
}
</style>
