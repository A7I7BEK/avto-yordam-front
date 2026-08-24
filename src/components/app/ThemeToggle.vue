<script
  setup
  lang="ts"
>
import { Moon, Sun } from '@lucide/vue';
import { computed } from 'vue';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.resolvedTheme === 'dark');
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    aria-label="Toggle theme"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="themeStore.toggleTheme()"
  >
    <Sun
      v-if="!isDark"
      :size="16"
    />
    <Moon
      v-else
      :size="16"
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
  color: var(--foreground);
  cursor: pointer;
  background: var(--muted);
  border: none;
  border-radius: 999px;
  transition: background 0.15s;
}

.theme-toggle:hover {
  background: var(--hover);
}
</style>
