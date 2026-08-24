import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

/** LocalStorage key used to persist the user's theme preference. */
export const THEME_STORAGE_KEY = 'app-theme';

/** Theme preference the user can pick (System follows the OS setting). */
export type ThemePreference = 'light' | 'dark' | 'system';

/** Effective theme actually applied to the document. */
export type ResolvedTheme = 'light' | 'dark';

const PREFERENCES: readonly ThemePreference[] = ['light', 'dark', 'system'];

function isPreference(value: string | null): value is ThemePreference {
  return PREFERENCES.includes(value as ThemePreference);
}

/** Read the persisted theme preference, defaulting to light. */
function readStoredPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isPreference(stored) ? stored : 'light';
  } catch {
    return 'light';
  }
}

/** Whether the operating system currently prefers a dark color scheme. */
function readSystemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export const useThemeStore = defineStore('theme', () => {
  const preference = ref<ThemePreference>(readStoredPreference());
  const systemDark = ref(readSystemDark());

  const systemMedia = window.matchMedia('(prefers-color-scheme: dark)');

  /** Effective theme: preference, or the OS scheme when set to system. */
  const resolvedTheme = computed<ResolvedTheme>(() => {
    if (preference.value === 'system') {
      return systemDark.value ? 'dark' : 'light';
    }
    return preference.value;
  });

  function applyTheme(theme: ResolvedTheme) {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  }

  /** Re-read the OS scheme; keeps system mode correct even if the
   * `change` event was missed (e.g. the tab was backgrounded). */
  function syncSystemDark() {
    systemDark.value = systemMedia.matches;
  }

  /** Attach listeners and apply the persisted theme. Called once at startup. */
  function init() {
    systemMedia.addEventListener('change', syncSystemDark);
    window.addEventListener('focus', syncSystemDark);
    document.addEventListener('visibilitychange', syncSystemDark);
    watch(resolvedTheme, applyTheme, { immediate: true });
  }

  function setTheme(next: ThemePreference) {
    preference.value = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Persistence is best-effort; the theme still applies for this session.
    }
  }

  /** Flip between light and dark based on the currently effective theme. */
  function toggleTheme() {
    setTheme(resolvedTheme.value === 'dark' ? 'light' : 'dark');
  }

  function isDark(): boolean {
    return resolvedTheme.value === 'dark';
  }

  return {
    preference,
    systemDark,
    resolvedTheme,
    init,
    setTheme,
    toggleTheme,
    isDark,
  };
});
