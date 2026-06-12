<script
  setup
  lang="ts"
>
import { Moon, Sun } from '@lucide/vue';
import { useProfessionalAppStore } from '@/stores/professionalApp';

const store = useProfessionalAppStore();
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    :title="store.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
    @click="store.toggleTheme()"
  >
    <Sun
      v-if="store.theme === 'light'"
      :size="16"
      color="#2A2933"
    />
    <Moon
      v-else
      :size="16"
      color="#2A2933"
    />
  </button>
</template>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  cursor: pointer;
  background: #f5f5f5;
  border: none;
  border-radius: 999px;
  transition: background 0.15s;
}

.theme-toggle:hover {
  background: #e8e8e8;
}
</style>
