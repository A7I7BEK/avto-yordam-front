<script
  setup
  lang="ts"
>
import logoUrl from '@/assets/logo/logo-light.png';

defineProps<{
  caption?: string;
}>();
</script>

<template>
  <div class="auth-brand">
    <img
      class="brand-logo"
      :src="logoUrl"
      alt="Avto Yordam logo"
    >
    <div class="brand-text">
      <span class="brand-name">Avto Yordam</span>
      <span
        v-if="caption"
        class="brand-caption"
      >
        {{ caption }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.auth-brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.brand-logo {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 10px;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-name {
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.1;
  color: var(--foreground);
}

.brand-caption {
  font-family: Inter, sans-serif;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 1.2px;
}
</style>
