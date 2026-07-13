<script
  setup
  lang="ts"
>
import { Search } from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { apiClient } from '@/api/client';
import { isMockMode } from '@/config';

const allLanguages = ref<{ id: string; value: string; label: string }[]>([]);
const searchQuery = ref('');

const filteredLanguages = computed(() => {
  if (!searchQuery.value) {
    return allLanguages.value;
  }
  const q = searchQuery.value.toLowerCase();
  return allLanguages.value.filter(
    (l) =>
      l.label.toLowerCase().includes(q) || l.value.toLowerCase().includes(q),
  );
});

const initialLanguages = ref<string[]>([]);
const selectedLanguages = ref<string[]>([]);
const isLoading = ref(false);
const isSaving = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

interface LanguageBackend {
  id: string;
  code?: string;
  name?: string;
}

interface MasterInfoLanguagesType {
  master?: {
    languages?: (string | LanguageBackend)[];
  };
}

function toggleLanguage(langValue: string) {
  const idx = selectedLanguages.value.indexOf(langValue);
  if (idx >= 0) {
    selectedLanguages.value.splice(idx, 1);
  } else {
    selectedLanguages.value.push(langValue);
  }
}

async function loadData() {
  if (isMockMode()) {
    allLanguages.value = [
      { id: 'uzbek', value: 'uzbek', label: 'Uzbek' },
      { id: 'russian', value: 'russian', label: 'Russian' },
      { id: 'english', value: 'english', label: 'English' },
      { id: 'german', value: 'german', label: 'German' },
      { id: 'tajik', value: 'tajik', label: 'Tajik' },
    ];
    initialLanguages.value = ['uzbek', 'russian'];
    selectedLanguages.value = ['uzbek', 'russian'];
    return;
  }

  isLoading.value = true;
  try {
    // 1. Fetch available languages from backend
    let langsRes: LanguageBackend[] = [];
    try {
      langsRes = (await apiClient.get('/language')) as LanguageBackend[];
    } catch {
      try {
        langsRes = (await apiClient.get('/languages')) as LanguageBackend[];
      } catch {
        langsRes = [];
      }
    }

    if (Array.isArray(langsRes) && langsRes.length > 0) {
      allLanguages.value = langsRes.map((l) => ({
        id: l.id,
        value: l.code || l.name?.toLowerCase() || '',
        label: l.name || '',
      }));
    }

    // 2. Fetch master info to get the user's selected languages
    const masterRes = await apiClient.get('/master-info/get-own');
    const masterInfo = (
      Array.isArray(masterRes) ? masterRes[0] : masterRes
    ) as MasterInfoLanguagesType;
    const userRes = masterInfo?.master;
    if (userRes && Array.isArray(userRes.languages)) {
      const selected = userRes.languages.map((l) => {
        if (typeof l === 'string') {
          return l;
        }
        return l.code || l.name?.toLowerCase() || '';
      });
      initialLanguages.value = selected;
      selectedLanguages.value = [...selected];
    }
  } catch {
    // Silent error handler, fallback to defaults
  } finally {
    isLoading.value = false;
  }
}

async function saveChanges() {
  if (isMockMode()) {
    successMessage.value = 'Languages saved successfully (Mock Mode).';
    return;
  }

  isSaving.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  try {
    const added = selectedLanguages.value.filter(
      (v) => !initialLanguages.value.includes(v),
    );
    const removed = initialLanguages.value.filter(
      (v) => !selectedLanguages.value.includes(v),
    );

    const promises: Promise<unknown>[] = [];

    for (const val of added) {
      const lang = allLanguages.value.find((l) => l.value === val);
      if (lang?.id) {
        promises.push(apiClient.post(`/user/add-language/${lang.id}`));
      }
    }

    for (const val of removed) {
      const lang = allLanguages.value.find((l) => l.value === val);
      if (lang?.id) {
        promises.push(apiClient.post(`/user/remove-language/${lang.id}`));
      }
    }

    await Promise.all(promises);
    initialLanguages.value = [...selectedLanguages.value];
    successMessage.value = 'Languages updated successfully.';
  } catch (err: unknown) {
    const errorVal = err as Record<string, unknown> | null;
    errorMessage.value =
      String(errorVal?.message || '') ||
      'Failed to update language settings. Please try again.';
  } finally {
    isSaving.value = false;
  }
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="section">
    <div class="section-title">Languages you speak</div>
    <p class="section-desc">Clients and organizations will see these.</p>

    <div
      v-if="isLoading"
      class="loading-state"
    >
      Loading languages...
    </div>
    <template v-else>
      <!-- Feedback Banners -->
      <div
        v-if="errorMessage"
        class="error-banner"
      >
        {{ errorMessage }}
      </div>
      <div
        v-if="successMessage"
        class="success-banner"
      >
        {{ successMessage }}
      </div>

      <!-- Selected Chips -->
      <div class="chips-grid">
        <button
          v-for="lang in filteredLanguages"
          :key="lang.value"
          class="chip"
          :class="{
            selected: selectedLanguages.includes(lang.value),
          }"
          type="button"
          :disabled="isSaving"
          @click="toggleLanguage(lang.value)"
        >
          {{ lang.label }}
        </button>
      </div>

      <!-- Add Language -->
      <div class="search-input">
        <Search
          :size="14"
          color="#616167"
        />
        <input
          v-model="searchQuery"
          class="search-field"
          type="text"
          placeholder="Search languages..."
          :disabled="isSaving"
        >
      </div>

      <div class="form-footer">
        <button
          class="btn btn-save"
          type="button"
          :disabled="isSaving"
          @click="saveChanges"
        >
          {{ isSaving ? 'Saving...' : 'Save changes' }}
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #2a2933;
}

.section-desc {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: #616167;
}

.chips-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 6px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #2a2933;
  cursor: pointer;
  background: transparent;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
  transition: all 0.15s;
}

.chip.selected {
  color: #ffffff;
  background: #5749f4;
  border-color: #5749f4;
}

.search-input {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 10px 16px;
  background: #f5f5f5;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.search-field {
  flex: 1;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #2a2933;
  outline: none;
  background: transparent;
  border: none;
}

.search-field::placeholder {
  color: #616167;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
}

.btn-save {
  padding: 10px 20px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  background: #5749f4;
  border: none;
  border-radius: 999px;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #616167;
}

.error-banner {
  padding: 12px 16px;
  margin-bottom: 12px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
}

.success-banner {
  padding: 12px 16px;
  margin-bottom: 12px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #155724;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
}
</style>
