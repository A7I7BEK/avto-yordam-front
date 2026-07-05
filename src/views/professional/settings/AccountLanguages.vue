<script
  setup
  lang="ts"
>
import { Search } from '@lucide/vue';
import { ref } from 'vue';

const allLanguages = [
  { value: 'uzbek', label: 'Uzbek' },
  { value: 'russian', label: 'Russian' },
  { value: 'english', label: 'English' },
  { value: 'german', label: 'German' },
  { value: 'tajik', label: 'Tajik' },
  { value: 'turkish', label: 'Turkish' },
  { value: 'french', label: 'French' },
  { value: 'korean', label: 'Korean' },
];

const selectedLanguages = ref<string[]>(['uzbek', 'russian']);

function toggleLanguage(lang: string) {
  const idx = selectedLanguages.value.indexOf(lang);
  if (idx >= 0) {
    selectedLanguages.value.splice(idx, 1);
  } else {
    selectedLanguages.value.push(lang);
  }
}
</script>

<template>
  <div class="section">
    <div class="section-title">Languages you speak</div>
    <p class="section-desc">Clients and organizations will see these.</p>

    <!-- Selected Chips -->
    <div class="chips-grid">
      <button
        v-for="lang in allLanguages"
        :key="lang.value"
        class="chip"
        :class="{
          selected: selectedLanguages.includes(lang.value),
        }"
        type="button"
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
        class="search-field"
        type="text"
        placeholder="Add a language..."
      >
    </div>

    <div class="form-footer">
      <button
        class="btn btn-save"
        type="button"
      >
        Save changes
      </button>
    </div>
  </div>
</template>

<style scoped>
.section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 24px;
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
</style>
