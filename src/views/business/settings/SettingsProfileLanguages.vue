<script
  setup
  lang="ts"
>
import { ChevronDown, Globe, Loader2, Plus, Trash2 } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import {
  addUserLanguage,
  getAllLanguages,
  getUserProfile,
  removeUserLanguage,
} from '@/services/userService';
import type { LanguageResponse } from '@/types/user';

const saveError = ref('');

const allLanguages = ref<LanguageResponse[]>([]);
const userLanguages = ref<LanguageResponse[]>([]);
const loading = ref(true);
const saving = ref(false);

interface LanguageEntry {
  tempId: number;
  language: LanguageResponse | null;
}

let nextTempId = 1;

const entries = ref<LanguageEntry[]>([]);

async function fetchData() {
  loading.value = true;
  try {
    const [langs, user] = await Promise.all([
      getAllLanguages(),
      getUserProfile(),
    ]);
    allLanguages.value = langs;
    userLanguages.value = user.languages;
    entries.value = user.languages.map((lang) => ({
      tempId: nextTempId++,
      language: lang,
    }));
  } catch {
    // Keep defaults on error
  } finally {
    loading.value = false;
  }
}

function getAvailableLanguages(): LanguageResponse[] {
  const addedIds = new Set(entries.value.map((e) => e.language?.id));
  return allLanguages.value.filter((lang) => !addedIds.has(lang.id));
}

function isLanguageTaken(languageId: string, excludeTempId: number): boolean {
  return entries.value.some(
    (e) => e.tempId !== excludeTempId && e.language?.id === languageId,
  );
}

function onLanguageChange(event: Event, entry: LanguageEntry) {
  const select = event.target as HTMLSelectElement;
  const langId = select.value;
  const lang = allLanguages.value.find((l) => l.id === langId) ?? null;
  entry.language = lang;
}

function addEntry() {
  const available = getAvailableLanguages();
  if (available.length === 0) {
    return;
  }
  entries.value.push({
    tempId: nextTempId++,
    language: available[0] ?? null,
  });
}

function removeEntry(tempId: number) {
  entries.value = entries.value.filter((e) => e.tempId !== tempId);
}

async function saveChanges() {
  saveError.value = '';
  saving.value = true;
  try {
    const currentIds = new Set(userLanguages.value.map((l) => l.id));
    const newIds = new Set(
      entries.value
        .map((e) => e.language?.id)
        .filter((id): id is string => id !== undefined),
    );

    const toAdd = [...newIds].filter((id) => !currentIds.has(id));
    const toRemove = [...currentIds].filter((id) => !newIds.has(id));

    await Promise.all([
      ...toAdd.map((id) => addUserLanguage(id)),
      ...toRemove.map((id) => removeUserLanguage(id)),
    ]);

    // Update saved state to match current entries (no re-fetch needed)
    userLanguages.value = entries.value
      .map((e) => e.language)
      .filter((l): l is LanguageResponse => l !== null);
  } catch (e: any) {
    saveError.value = e.message ?? 'Failed to save changes';
  } finally {
    saving.value = false;
  }
}

onMounted(fetchData);
</script>

<template>
  <div class="card">
    <!-- Header -->
    <div class="card-header">
      <div class="header-title-group">
        <span class="header-title">Languages</span>
        <span class="header-desc"
          >Add every language you speak and how well. Shown to customers on your
          public profile.</span
        >
      </div>
      <div class="badge-count">
        <Globe
          :size="12"
          color="var(--muted-foreground)"
        />
        <span>{{ entries.length }} added</span>
      </div>
    </div>

    <div class="divider" />

    <!-- Loading State -->
    <div
      v-if="loading"
      class="loading-state"
    >
      <Loader2
        :size="20"
        color="var(--muted-foreground)"
        class="spin"
      />
      <span>Loading languages...</span>
    </div>

    <!-- Language List -->
    <div
      v-else
      class="lang-list"
    >
      <div
        v-for="entry in entries"
        :key="entry.tempId"
        class="lang-row"
      >
        <div class="lang-field">
          <span class="field-label">Language</span>
          <div class="select-wrapper">
            <select
              :value="entry.language?.id ?? ''"
              class="select-pill"
              @change="onLanguageChange($event, entry)"
            >
              <option
                value=""
                disabled
              >
                Select language
              </option>
              <option
                v-for="lang in allLanguages"
                :key="lang.id"
                :value="lang.id"
                :disabled="isLanguageTaken(lang.id, entry.tempId)"
              >
                {{ lang.name }}
              </option>
            </select>
            <ChevronDown
              :size="14"
              color="var(--muted-foreground)"
              class="select-chevron"
            />
          </div>
        </div>
        <button
          class="btn-delete"
          type="button"
          @click="removeEntry(entry.tempId)"
        >
          <Trash2 :size="15" />
        </button>
      </div>
    </div>

    <!-- Error message -->
    <div
      v-if="saveError"
      class="error-message"
    >
      {{ saveError }}
    </div>

    <!-- Add another language -->
    <button
      class="btn-add"
      :class="{ disabled: getAvailableLanguages().length === 0 }"
      type="button"
      :disabled="getAvailableLanguages().length === 0"
      @click="addEntry"
    >
      <Plus
        :size="15"
        color="var(--primary)"
      />
      <span>Add another language</span>
    </button>

    <div class="divider" />

    <!-- Footer -->
    <div class="card-footer">
      <button
        class="btn-cancel"
        type="button"
      >
        Cancel
      </button>
      <button
        class="btn-save"
        :disabled="saving"
        type="button"
        @click="saveChanges"
      >
        <Loader2
          v-if="saving"
          :size="13"
          class="spin"
        />
        <span>{{ saving ? 'Saving...' : 'Save changes' }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 24px;
}

/* Header */
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.header-title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-title {
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
}

.header-desc {
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: var(--muted-foreground);
}

.badge-count {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 4px 12px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: var(--muted-foreground);
  background: var(--muted);
  border-radius: 999px;
}

/* Divider */
.divider {
  width: 100%;
  height: 1px;
  background: var(--border-soft);
}

/* Language List */
.lang-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lang-row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  padding: 14px;
  background: var(--muted);
  border: 1px solid var(--border-soft);
  border-radius: 6px;
}

.lang-field {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: var(--muted-foreground);
}

/* Select wrapper */
.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.select-pill {
  box-sizing: border-box;
  width: 100%;
  padding: 10px 36px 10px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--foreground);
  appearance: none;
  cursor: pointer;
  outline: none;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 6px;
}

.select-pill:focus {
  border-color: var(--primary);
}

.select-chevron {
  position: absolute;
  right: 14px;
  pointer-events: none;
}

/* Delete button */
.btn-delete {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  color: var(--destructive);
  cursor: pointer;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
}

.btn-delete:hover {
  background: var(--destructive-soft);
}

/* Add button */
.btn-add {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 14px 16px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 6px;
}

/* Error message */
.error-message {
  padding: 10px 14px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: var(--destructive);
  background: var(--destructive-soft);
  border: 1px solid var(--destructive);
  border-radius: 6px;
}

.btn-add:hover {
  background: var(--primary-tint);
}

.btn-add.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.btn-add.disabled:hover {
  background: var(--card);
}

/* Loading state */
.loading-state {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: var(--muted-foreground);
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Footer */
.card-footer {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 8px;
}

.btn-cancel {
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-foreground);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--border-soft);
  border-radius: 999px;
}

.btn-save {
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--primary-foreground);
  cursor: pointer;
  background: var(--primary);
  border: none;
  border-radius: 999px;
}

@media (max-width: 640px) {
  .card {
    padding: 18px 16px;
    border-radius: 20px;
  }

  .card-footer {
    flex-direction: column;
    gap: 8px;
  }

  .btn-cancel,
  .btn-save {
    justify-content: center;
    width: 100%;
  }
}
</style>
