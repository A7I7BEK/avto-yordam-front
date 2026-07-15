<script
  setup
  lang="ts"
>
import { ChevronDown, Globe, Plus, Trash2 } from '@lucide/vue';
import { ref } from 'vue';

const languageOptions = [
  { value: 'uzbek', label: 'Uzbek' },
  { value: 'russian', label: 'Russian' },
  { value: 'english', label: 'English' },
  { value: 'german', label: 'German' },
  { value: 'tajik', label: 'Tajik' },
  { value: 'turkish', label: 'Turkish' },
  { value: 'french', label: 'French' },
  { value: 'korean', label: 'Korean' },
];

const proficiencyOptions = [
  'Native or bilingual',
  'Professional working',
  'Limited working',
  'Elementary',
];

interface LanguageEntry {
  id: number;
  language: string;
  proficiency: string;
}

let nextId = 4;

const entries = ref<LanguageEntry[]>([
  { id: 1, language: 'uzbek', proficiency: 'Native or bilingual' },
  { id: 2, language: 'russian', proficiency: 'Native or bilingual' },
  { id: 3, language: 'english', proficiency: 'Professional working' },
]);

function addEntry() {
  entries.value.push({
    id: nextId++,
    language: '',
    proficiency: proficiencyOptions[0] ?? 'Native or bilingual',
  });
}

function removeEntry(id: number) {
  entries.value = entries.value.filter((e) => e.id !== id);
}

function saveChanges() {
  // Mock save
}
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
          color="#616167"
        />
        <span>{{ entries.length }} added</span>
      </div>
    </div>

    <div class="divider" />

    <!-- Language List -->
    <div class="lang-list">
      <div
        v-for="entry in entries"
        :key="entry.id"
        class="lang-row"
      >
        <div class="lang-field">
          <span class="field-label">Language</span>
          <div class="select-wrapper">
            <select
              v-model="entry.language"
              class="select-pill"
            >
              <option
                value=""
                disabled
              >
                Select language
              </option>
              <option
                v-for="opt in languageOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
            <ChevronDown
              :size="14"
              color="#616167"
              class="select-chevron"
            />
          </div>
        </div>
        <div class="lang-field">
          <span class="field-label">Proficiency</span>
          <div class="select-wrapper">
            <select
              v-model="entry.proficiency"
              class="select-pill"
            >
              <option
                v-for="opt in proficiencyOptions"
                :key="opt"
                :value="opt"
              >
                {{ opt }}
              </option>
            </select>
            <ChevronDown
              :size="14"
              color="#616167"
              class="select-chevron"
            />
          </div>
        </div>
        <button
          class="btn-delete"
          type="button"
          @click="removeEntry(entry.id)"
        >
          <Trash2 :size="15" />
        </button>
      </div>
    </div>

    <!-- Add another language -->
    <button
      class="btn-add"
      type="button"
      @click="addEntry"
    >
      <Plus
        :size="15"
        color="#5749f4"
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
        type="button"
        @click="saveChanges"
      >
        Save changes
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
  background: #ffffff;
  border: 1px solid #c5c5cb;
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
  color: #2a2933;
}

.header-desc {
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: #616167;
}

.badge-count {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 4px 12px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #616167;
  background: #f5f5f5;
  border-radius: 999px;
}

/* Divider */
.divider {
  width: 100%;
  height: 1px;
  background: #c5c5cb;
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
  background: #f5f5f5;
  border: 1px solid #c5c5cb;
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
  color: #616167;
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
  color: #2a2933;
  appearance: none;
  cursor: pointer;
  outline: none;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 6px;
}

.select-pill:focus {
  border-color: #5749f4;
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
  color: #cc3314;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.btn-delete:hover {
  background: #fff5f5;
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
  color: #5749f4;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 6px;
}

.btn-add:hover {
  background: #f5f5ff;
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
  color: #616167;
  cursor: pointer;
  background: transparent;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.btn-save {
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  background: #5749f4;
  border: none;
  border-radius: 999px;
}
</style>
