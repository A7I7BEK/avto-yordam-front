<script
  setup
  lang="ts"
>
import { Check, Copy } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { getSettingsBankInfo } from '@/services/settingsService';

interface BankInfo {
  accountHolder: string;
  bank: string;
  mfo: string;
  inn: string;
  accountNumber: string;
  currency: string;
}

const bankInfo = ref<BankInfo | null>(null);
const copiedField = ref<string | null>(null);

onMounted(async () => {
  const data = await getSettingsBankInfo();
  if (data) {
    bankInfo.value = { ...data };
  }
});

async function copyToClipboard(value: string, field: string) {
  try {
    await navigator.clipboard.writeText(value);
    copiedField.value = field;
    setTimeout(() => {
      copiedField.value = null;
    }, 2000);
  } catch {
    // Fallback
  }
}

const fields = [
  { key: 'accountHolder', label: 'Account holder' },
  { key: 'bank', label: 'Bank name' },
  { key: 'mfo', label: 'MFO' },
  { key: 'inn', label: 'INN' },
  { key: 'accountNumber', label: 'Account number' },
  { key: 'currency', label: 'Currency' },
];
</script>

<template>
  <div class="settings-page">
    <div class="header-row">
      <h1 class="page-title">Bank information</h1>
    </div>

    <div
      v-if="bankInfo"
      class="bank-card"
    >
      <div
        v-for="field in fields"
        :key="field.key"
        class="bank-row"
      >
        <div class="bank-row__label">{{ field.label }}</div>
        <div class="bank-row__value-group">
          <span class="bank-row__value"
            >{{ bankInfo[field.key as keyof BankInfo] }}</span
          >
          <button
            type="button"
            class="btn-copy"
            title="Copy to clipboard"
            @click="copyToClipboard(bankInfo[field.key as keyof BankInfo], field.key)"
          >
            <Copy
              v-if="copiedField !== field.key"
              :size="14"
            />
            <Check
              v-else
              :size="14"
              color="#25603a"
            />
          </button>
        </div>
      </div>
    </div>

    <div
      v-else
      class="empty-state"
    >
      Bank information not available.
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

.bank-card {
  overflow: hidden;
  border: 1px solid #d9d9db;
  border-radius: 10px;
}

.bank-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.bank-row:last-child {
  border-bottom: none;
}

.bank-row__label {
  min-width: 140px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #616167;
}

.bank-row__value-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.bank-row__value {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #2a2933;
  text-align: right;
}

.btn-copy {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  color: #939399;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 6px;
  transition: all 0.15s;
}

.btn-copy:hover {
  color: #5749f4;
  background: #f5f5f5;
}

.empty-state {
  padding: 60px 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #939399;
  text-align: center;
}
</style>
