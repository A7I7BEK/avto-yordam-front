<script
  setup
  lang="ts"
>
import { AlertTriangle } from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { getSettingsDangerZone } from '@/services/settingsService';

const orgName = ref('');
const confirmText = ref('');

onMounted(async () => {
  const data = await getSettingsDangerZone();
  if (data) {
    orgName.value = data.orgName;
  }
});

const canDelete = computed(() => confirmText.value === orgName.value);

function deleteOrganization() {
  if (canDelete.value) {
    // Delete org logic
  }
}
</script>

<template>
  <div class="settings-page">
    <div class="header-row">
      <h1 class="page-title">Danger Zone</h1>
    </div>

    <div class="danger-card">
      <div class="danger-card__icon">
        <AlertTriangle
          :size="24"
          color="#cc3314"
        />
      </div>
      <div class="danger-card__body">
        <h2 class="danger-card__title">Delete organization</h2>
        <p class="danger-card__desc">
          This action is irreversible. All data including orders, earnings,
          employees, and settings will be permanently deleted. Please proceed
          with caution.
        </p>

        <div class="danger-form">
          <label class="danger-form__label">
            Type <strong>{{ orgName }}</strong> to confirm deletion
          </label>
          <input
            v-model="confirmText"
            type="text"
            class="danger-form__input"
            :placeholder="`Type ${orgName} to confirm`"
          >
        </div>

        <button
          type="button"
          class="btn btn--danger"
          :disabled="!canDelete"
          @click="deleteOrganization"
        >
          Delete this organization
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  max-width: 640px;
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

.danger-card {
  display: flex;
  gap: 16px;
  padding: 24px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
}

.danger-card__icon {
  display: flex;
  flex-shrink: 0;
}

.danger-card__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.danger-card__title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #cc3314;
}

.danger-card__desc {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  line-height: 1.5;
  color: #cc3314;
}

.danger-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.danger-form__label {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #cc3314;
}

.danger-form__input {
  max-width: 400px;
  padding: 10px 14px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #2a2933;
  outline: none;
  background: #ffffff;
  border: 1px solid #fecaca;
  border-radius: 8px;
  transition: border-color 0.15s;
}

.danger-form__input:focus {
  border-color: #cc3314;
}

.btn {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  align-self: flex-start;
  padding: 10px 24px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: 999px;
  transition: all 0.15s;
}

.btn--danger {
  color: #ffffff;
  background: #cc3314;
}

.btn--danger:hover:not(:disabled) {
  background: #a8280f;
}

.btn--danger:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}
</style>
