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
  background: #f5f5f5;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.lang-chip {
  padding: 4px 10px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #616167;
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
  color: #2a2933;
  background: #ffffff;
}
</style>
