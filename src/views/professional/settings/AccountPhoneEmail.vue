<script
  setup
  lang="ts"
>
import { BadgeCheck, Plus } from '@lucide/vue';
import { ref } from 'vue';

const primaryEmail = ref('aziz.karimov@masters.uz');
const additionalEmail = ref('');

function addEmail() {
  // Stub for MVP
}
</script>

<template>
  <div class="section">
    <div class="section-title">Phone number</div>

    <!-- Phone -->
    <div class="phone-row">
      <div class="phone-display">
        <span>+998 90 123 45 67</span>
        <BadgeCheck
          :size="14"
          color="#003300"
        />
        <span class="verified-text">Verified</span>
      </div>
      <button
        class="outline-btn"
        type="button"
      >
        Change number
      </button>
    </div>

    <div class="divider" />

    <div class="section-title">Email addresses</div>

    <!-- Primary Email -->
    <div class="email-row">
      <div class="email-display">
        <span>{{ primaryEmail }}</span>
        <span class="primary-badge">Primary</span>
      </div>
    </div>

    <!-- Add Email -->
    <div class="add-email-row">
      <input
        v-model="additionalEmail"
        class="field-input"
        type="email"
        placeholder="Add another email..."
      >
      <button
        class="add-btn"
        type="button"
        @click="addEmail"
      >
        <Plus :size="14" />
        Add
      </button>
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
}

.section-title {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #2a2933;
}

.phone-row {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.phone-display {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #2a2933;
  background: #f5f5f5;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.verified-text {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #003300;
}

.outline-btn {
  padding: 8px 14px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #2a2933;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.divider {
  width: 100%;
  height: 1px;
  background: #c5c5cb;
}

.email-row {
  display: flex;
  align-items: center;
}

.email-display {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #2a2933;
  background: #f5f5f5;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.primary-badge {
  padding: 3px 8px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #003300;
  background: #a1e5a1;
  border-radius: 999px;
}

.add-email-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.field-input {
  flex: 1;
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #2a2933;
  outline: none;
  background: #f5f5f5;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.field-input::placeholder {
  color: #616167;
}

.add-btn {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 8px 14px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  background: #5749f4;
  border: none;
  border-radius: 999px;
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
