<script
  setup
  lang="ts"
>
import { onMounted, ref } from 'vue';
import { getSettingsAppearance } from '@/services/settingsService';

interface AppearanceData {
  theme: string;
  language: string;
  fontSize: string;
}

const settings = ref<AppearanceData>({
  theme: 'light',
  language: 'EN',
  fontSize: 'medium',
});

const themes = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const languages = [
  { value: 'EN', label: 'English' },
  { value: 'UZ', label: "O'zbek" },
  { value: 'RU', label: 'Русский' },
];

const fontSizes = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

onMounted(async () => {
  const data = await getSettingsAppearance();
  if (data) {
    settings.value = { ...data };
  }
});
</script>

<template>
  <div class="settings-page">
    <div class="header-row">
      <h1 class="page-title">Appearance & Language</h1>
    </div>

    <div class="settings-group">
      <!-- Theme -->
      <div class="setting-section">
        <h2 class="setting-section__title">Theme</h2>
        <p class="setting-section__desc">Choose how the interface looks</p>
        <div class="option-group">
          <button
            v-for="theme in themes"
            :key="theme.value"
            type="button"
            class="option-btn"
            :class="{ active: settings.theme === theme.value }"
            @click="settings.theme = theme.value"
          >
            {{ theme.label }}
          </button>
        </div>
      </div>

      <!-- Language -->
      <div class="setting-section">
        <h2 class="setting-section__title">Language</h2>
        <p class="setting-section__desc">Select your preferred language</p>
        <div class="option-group">
          <button
            v-for="lang in languages"
            :key="lang.value"
            type="button"
            class="option-btn"
            :class="{ active: settings.language === lang.value }"
            @click="settings.language = lang.value"
          >
            {{ lang.label }}
          </button>
        </div>
      </div>

      <!-- Font Size -->
      <div class="setting-section">
        <h2 class="setting-section__title">Font size</h2>
        <p class="setting-section__desc">Adjust the text size</p>
        <div class="option-group">
          <button
            v-for="size in fontSizes"
            :key="size.value"
            type="button"
            class="option-btn"
            :class="{ active: settings.fontSize === size.value }"
            @click="settings.fontSize = size.value"
          >
            {{ size.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  max-width: 600px;
  padding: 24px 32px;
}

.header-row {
  margin-bottom: 24px;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #2a2933;
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.setting-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-section__title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #2a2933;
}

.setting-section__desc {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #616167;
}

.option-group {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.option-btn {
  padding: 8px 20px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #616167;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #d9d9db;
  border-radius: 8px;
  transition: all 0.15s;
}

.option-btn:hover {
  color: #5749f4;
  border-color: #5749f4;
}

.option-btn.active {
  color: #ffffff;
  background: #5749f4;
  border-color: #5749f4;
}
</style>
