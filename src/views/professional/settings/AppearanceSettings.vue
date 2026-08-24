<script
  setup
  lang="ts"
>
import { Check, Monitor, Moon, Sun } from '@lucide/vue';
import { ref } from 'vue';
import flagEn from '@/assets/flags/flag-en.png';
import flagRu from '@/assets/flags/flag-ru.png';
import flagUz from '@/assets/flags/flag-uz.png';
import { getStoredLanguage, setStoredLanguage } from '@/config/language';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
const selectedLanguage = ref(getStoredLanguage());

function selectLanguage(languageKey: string) {
  selectedLanguage.value = languageKey;
  setStoredLanguage(languageKey);
}

const themes = [
  {
    key: 'light' as const,
    label: 'Light',
    icon: Sun,
    previewBg: '#FFFFFF',
    previewSidebar: '#F5F5F5',
    previewBlocks: ['#F5F5F5', '#F5F5F5'],
  },
  {
    key: 'dark' as const,
    label: 'Dark',
    icon: Moon,
    previewBg: '#131124',
    previewSidebar: '#1A182E',
    previewBlocks: ['#1A182E', '#1A182E'],
  },
  {
    key: 'system' as const,
    label: 'System',
    icon: Monitor,
    previewBg: 'linear-gradient(90deg, #FFFFFF 50%, #131124 50%)',
    previewSidebar: undefined,
    previewBlocks: undefined,
  },
];

const languages = [
  {
    key: 'english',
    name: 'English',
    code: 'EN',
    flagImage: flagEn,
  },
  {
    key: 'uzbek',
    name: 'Uzbek',
    code: 'UZ',
    flagImage: flagUz,
  },
  {
    key: 'russian',
    name: 'Russian',
    code: 'RU',
    flagImage: flagRu,
  },
];
</script>

<template>
  <div class="appearance-page">
    <div class="page-header">
      <h2 class="page-title">Appearance &amp; language</h2>
    </div>

    <!-- Theme Section -->
    <div class="section-label">Theme</div>
    <div class="theme-cards-row">
      <div
        v-for="theme in themes"
        :key="theme.key"
        class="theme-card"
        :class="{ selected: themeStore.preference === theme.key }"
        role="button"
        tabindex="0"
        @click="themeStore.setTheme(theme.key)"
        @keydown.enter="themeStore.setTheme(theme.key)"
      >
        <!-- Preview Area -->
        <div
          class="theme-preview"
          :style="{ background: theme.previewBg }"
        >
          <template v-if="theme.key !== 'system'">
            <div
              class="preview-sidebar"
              :style="{
                background: theme.previewSidebar,
              }"
            />
            <div class="preview-content">
              <div
                v-for="(block, idx) in theme.previewBlocks"
                :key="idx"
                class="preview-block"
                :style="{ background: block }"
              />
            </div>
          </template>
          <template v-else>
            <div class="preview-sidebar light-sidebar" />
            <div class="preview-content light-content">
              <div class="preview-block light-block" />
              <div class="preview-block light-block" />
            </div>
            <div class="preview-divider" />
            <div class="preview-sidebar dark-sidebar" />
            <div class="preview-content dark-content">
              <div class="preview-block dark-block" />
              <div class="preview-block dark-block" />
            </div>
          </template>
        </div>

        <!-- Footer -->
        <div class="theme-footer">
          <div class="theme-label-row">
            <component
              :is="theme.icon"
              :size="16"
              color="var(--foreground)"
            />
            <span>{{ theme.label }}</span>
          </div>
          <div
            class="theme-radio"
            :class="{ selected: themeStore.preference === theme.key }"
          >
            <div
              v-if="themeStore.preference === theme.key"
              class="radio-dot"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Language Section -->
    <div class="section-label">Language</div>
    <div class="language-list">
      <div
        v-for="lang in languages"
        :key="lang.key"
        class="language-item"
        :class="{ selected: selectedLanguage === lang.key }"
        role="button"
        tabindex="0"
        @click="selectLanguage(lang.key)"
        @keydown.enter="selectLanguage(lang.key)"
      >
        <img
          :src="lang.flagImage"
          :alt="`${lang.name} flag`"
          class="flag-image"
        >
        <div class="lang-info">
          <span class="lang-name">{{ lang.name }}</span>
          <span class="lang-code">{{ lang.code }}</span>
        </div>
        <div
          class="lang-check"
          :class="{ 'active': selectedLanguage === lang.key }"
        >
          <Check
            :size="10"
            color="#FFFFFF"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.appearance-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--foreground);
}

.section-label {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}

.theme-cards-row {
  display: flex;
  gap: 16px;
}

.theme-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  cursor: pointer;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 24px;
}

.theme-card.selected {
  border-color: var(--primary);
}

.theme-preview {
  position: relative;
  display: flex;
  height: 120px;
  overflow: hidden;
  border: 1px solid var(--border-soft);
  border-radius: 6px;
}

.preview-sidebar {
  flex-shrink: 0;
  width: 32px;
}

.preview-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
}

.preview-block {
  height: 20px;
  border-radius: 3px;
}

.light-sidebar {
  background: #f5f5f5;
}

.light-content {
  background: #ffffff;
}

.light-block {
  background: #f5f5f5;
}

.dark-sidebar {
  background: #1a182e;
}

.dark-content {
  background: #131124;
}

.dark-block {
  background: #1a182e;
}

.preview-divider {
  flex-shrink: 0;
  width: 2px;
  background: #c5c5cb;
}

.theme-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.theme-label-row {
  display: flex;
  gap: 6px;
  align-items: center;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
}

.theme-radio {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1px solid var(--border-soft);
  border-radius: 999px;
}

.theme-radio.selected {
  background: var(--primary);
  border-color: var(--primary);
}

.radio-dot {
  width: 4px;
  height: 4px;
  background: #ffffff;
  border-radius: 999px;
}

.language-list {
  display: flex;
  gap: 16px;
}

.language-item {
  display: flex;
  flex: 1;
  gap: 14px;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 24px;
}

.language-item.selected {
  border-color: var(--primary);
}

.flag-image {
  flex-shrink: 0;
  height: 22px;
  object-fit: cover;
  border-radius: 4px;
}

.lang-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
}

.lang-name {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}

.lang-code {
  font-family: Inter, sans-serif;
  font-size: 11px;
  color: var(--muted-foreground);
}

.lang-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: var(--primary);
  border-radius: 999px;
  opacity: 0;
}
.lang-check.active {
  opacity: 1;
}
</style>
