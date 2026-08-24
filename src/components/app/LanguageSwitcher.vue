<script
  setup
  lang="ts"
>
import { useProfessionalAppStore } from '@/stores/professionalApp';

const store = useProfessionalAppStore();
const languages = ['EN', 'UZ', 'RU'] as const;
</script>

<template>
  <div class="lang-switcher">
    <button
      v-for="lang in languages"
      :key="lang"
      class="lang-chip"
      :class="{ active: store.language === lang }"
      type="button"
      @click="store.setLanguage(lang)"
    >
      {{ lang }}
    </button>
  </div>
</template>

<style scoped>
.lang-switcher {
  display: flex;
  gap: 2px;
  padding: 4px;
  background: var(--muted);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
}

.lang-chip {
  padding: 4px 10px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-foreground);
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 999px;
  transition:
    background 0.15s,
    color 0.15s;
}

.lang-chip.active {
  font-weight: 600;
  color: var(--foreground);
  background: var(--card);
}
</style>
