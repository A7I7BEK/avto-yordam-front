<script
  setup
  lang="ts"
>
import { CircleCheck, CircleX, Eye, Info, Pencil, Play } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import clickLogo from '@/assets/payment-providers/click.png';
import paymeLogo from '@/assets/payment-providers/payme.jpg';
import paynetLogo from '@/assets/payment-providers/paynet.png';
import { getSettingsPayment } from '@/services/settingsService';

interface ProviderField {
  label: string;
  value: string;
  secret?: boolean;
}

interface Provider {
  id: string;
  name: string;
  enabled: boolean;
  fee: string;
  color: string;
  fields: ProviderField[];
  lastCharge: string;
  hasActivity: boolean;
}

const providers = ref<Provider[]>([]);

const fieldConfigs: Record<string, ProviderField[]> = {
  payme: [
    { label: 'Merchant ID', value: '680e8a7c2f9d1b3c4e5a6789' },
    { label: 'Secret key', value: '•••••••••••••••••••', secret: true },
  ],
  click: [
    { label: 'Service ID', value: '31247' },
    { label: 'Secret key', value: '•••••••••••••••••••', secret: true },
  ],
  paynet: [
    { label: 'Terminal ID', value: 'Not configured' },
    { label: 'API token', value: 'Not configured' },
  ],
};

const lastChargeTexts: Record<string, string> = {
  payme: 'Last charge: 2 min ago',
  click: 'Last charge: 27 min ago',
  paynet: 'Never used',
};

const providerLogos: Record<string, string> = {
  payme: paymeLogo,
  click: clickLogo,
  paynet: paynetLogo,
};

const revealedKeys = ref<Record<string, boolean>>({});
const editingProviders = ref<Record<string, boolean>>({});
const savedFields = ref<Record<string, string>>({});

onMounted(async () => {
  const data = await getSettingsPayment();
  if (data) {
    providers.value = data
      .filter((p) => p.type === 'online')
      .map((p) => ({
        id: p.id,
        name: p.name,
        enabled: p.enabled,
        fee: p.fee,
        color: providerLogos[p.id] ?? '',
        fields: (fieldConfigs[p.id] ?? []).map((f) => ({ ...f })),
        lastCharge: lastChargeTexts[p.id] ?? 'Never used',
        hasActivity: p.enabled && p.id !== 'paynet',
      }));
  }
});

function toggleProvider(id: string) {
  const provider = providers.value.find((p) => p.id === id);
  if (provider) {
    provider.enabled = !provider.enabled;
    if (provider.id === 'paynet') {
      provider.hasActivity = provider.enabled;
    }
  }
}

function toggleReveal(providerId: string, fieldIndex: number) {
  const key = `${providerId}-${fieldIndex}`;
  revealedKeys.value[key] = !revealedKeys.value[key];
}

function isRevealed(providerId: string, fieldIndex: number): boolean {
  return !!revealedKeys.value[`${providerId}-${fieldIndex}`];
}

function isEditing(providerId: string): boolean {
  return !!editingProviders.value[providerId];
}

function startEditing(providerId: string) {
  const provider = providers.value.find((p) => p.id === providerId);
  if (!provider) {
    return;
  }
  for (const [index, field] of provider.fields.entries()) {
    const key = `${providerId}-field-${index}`;
    savedFields.value[key] = field.value;
  }
  editingProviders.value[providerId] = true;
}

function cancelEditing(providerId: string) {
  const provider = providers.value.find((p) => p.id === providerId);
  if (!provider) {
    return;
  }
  for (const [index, field] of provider.fields.entries()) {
    const key = `${providerId}-field-${index}`;
    if (savedFields.value[key] !== undefined) {
      field.value = savedFields.value[key];
    }
  }
  editingProviders.value[providerId] = false;
}

function saveEditing(providerId: string) {
  editingProviders.value[providerId] = false;
}
</script>

<template>
  <div class="payment-page">
    <!-- Page header -->
    <div class="page-header">
      <h1 class="page-title">Payment providers</h1>
      <p class="page-subtitle">
        Configure online payment redirects. Pay at service (cash) is always
        available without setup.
      </p>
    </div>

    <!-- Provider cards -->
    <div class="providers-grid">
      <div
        v-for="provider in providers"
        :key="provider.id"
        class="provider-card"
      >
        <!-- Header row -->
        <div class="provider-header">
          <div class="provider-header-left">
            <div class="provider-icon">
              <img
                :src="provider.color"
                :alt="provider.name"
                class="provider-icon-img"
              >
            </div>
            <div class="provider-info">
              <span class="provider-name">{{ provider.name }}</span>
              <span class="provider-fee">
                {{ provider.fee }}
                per transaction
              </span>
            </div>
          </div>
          <button
            type="button"
            class="toggle-switch"
            :class="{ 'toggle-switch--on': provider.enabled }"
            :aria-label="`Toggle ${provider.name}`"
            @click="toggleProvider(provider.id)"
          >
            <span class="toggle-knob" />
          </button>
        </div>

        <!-- Divider -->
        <div class="provider-divider" />

        <!-- Fields -->
        <div
          v-for="(field, index) in provider.fields"
          :key="`${provider.id}-field-${index}`"
          class="provider-field"
        >
          <label
            class="field-label"
            :for="`${provider.id}-field-${index}`"
            >{{ field.label }}</label
          >
          <div
            v-if="field.secret"
            class="field-input-wrap"
            :class="{
              'field-input-wrap--empty': field.value === 'Not configured',
            }"
          >
            <input
              :id="`${provider.id}-field-${index}`"
              v-model="field.value"
              :type="isRevealed(provider.id, index) ? 'text' : 'password'"
              class="field-input"
              :class="{
                'field-input--empty': field.value === 'Not configured',
              }"
              :disabled="!isEditing(provider.id)"
            >
            <button
              type="button"
              class="field-eye-btn"
              :aria-label="isRevealed(provider.id, index) ? 'Hide' : 'Show'"
              @click="toggleReveal(provider.id, index)"
            >
              <Eye
                :size="14"
                class="field-eye-icon"
              />
            </button>
          </div>
          <input
            v-else
            :id="`${provider.id}-field-${index}`"
            v-model="field.value"
            type="text"
            class="field-input"
            :class="{
              'field-input--empty': field.value === 'Not configured',
            }"
            :disabled="!isEditing(provider.id)"
          >
        </div>

        <!-- Status row -->
        <div class="provider-status">
          <div class="status-indicator">
            <span
              class="status-dot"
              :class="{
                'status-dot--active': provider.hasActivity,
                'status-dot--inactive': !provider.hasActivity,
              }"
            />
            <span class="status-text">{{ provider.lastCharge }}</span>
          </div>
          <div class="status-actions">
            <button
              type="button"
              class="btn-test"
              :class="{ 'btn-test--disabled': !provider.enabled }"
              :disabled="!provider.enabled"
            >
              <Play :size="12" />
              Test redirect
            </button>
            <template v-if="isEditing(provider.id)">
              <button
                type="button"
                class="btn btn--outline"
                @click="cancelEditing(provider.id)"
              >
                <CircleX :size="13" />
                Cancel
              </button>
              <button
                type="button"
                class="btn btn--primary"
                @click="saveEditing(provider.id)"
              >
                <CircleCheck :size="13" />
                Save
              </button>
            </template>
            <button
              v-else
              type="button"
              class="btn btn--edit"
              @click="startEditing(provider.id)"
            >
              <Pencil :size="13" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Refunds banner -->
    <div class="info-banner">
      <Info
        :size="18"
        class="info-icon"
      />
      <div class="info-text">
        <span class="info-title">Refunds — coming soon</span>
        <span class="info-desc">
          Provider-issued refunds will arrive in a future update. In the
          meantime, refunds can be issued manually outside the platform.
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== Page header ===== */
.page-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--foreground);
}

.page-subtitle {
  max-width: 600px;
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ===== Providers grid ===== */
.providers-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

/* ===== Provider card ===== */
.provider-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

/* ===== Provider header ===== */
.provider-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.provider-header-left {
  display: flex;
  gap: 10px;
  align-items: center;
}

.provider-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  overflow: hidden;
  border-radius: var(--radius-sm);
}

.provider-icon-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.provider-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.provider-name {
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: var(--foreground);
}

.provider-fee {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ===== Toggle switch ===== */
.toggle-switch {
  display: flex;
  align-items: center;
  width: 40px;
  height: 22px;
  padding: 3px;
  cursor: pointer;
  background: var(--border-soft);
  border: none;
  border-radius: var(--radius-pill);
  transition: background 0.2s ease;
}

.toggle-switch--on {
  justify-content: flex-end;
  background: var(--primary);
}

.toggle-knob {
  display: block;
  width: 16px;
  height: 16px;
  background: var(--background);
  border-radius: var(--radius-pill);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

/* ===== Divider ===== */
.provider-divider {
  height: 1px;
  background: var(--border);
}

/* ===== Provider field ===== */
.provider-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: var(--muted-foreground);
}

.field-input {
  width: 100%;
  padding: 10px 14px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--foreground);
  outline: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.field-input:disabled {
  cursor: default;
  background: var(--accent);
  opacity: 1;
}

.field-input--empty {
  color: var(--muted-foreground);
}

.field-input--empty:disabled {
  color: var(--muted-foreground);
  -webkit-text-fill-color: var(--muted-foreground);
}

.field-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.field-input-wrap .field-input {
  padding-right: 36px;
}

.field-eye-btn {
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  color: var(--muted-foreground);
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 4px;
}

.field-eye-btn:hover {
  color: var(--foreground);
}

.field-eye-icon {
  flex-shrink: 0;
}

/* ===== Status row ===== */
.provider-status {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.status-indicator {
  display: flex;
  gap: 6px;
  align-items: center;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-pill);
}

.status-dot--active {
  background: #003300;
}

.status-dot--inactive {
  background: var(--muted-foreground);
}

.status-text {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ===== Test redirect button ===== */
.btn-test {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  align-self: flex-start;
  padding: 6px 12px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
  cursor: pointer;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  transition:
    background 0.15s,
    border-color 0.15s;
}

.btn-test:hover:not(:disabled) {
  border-color: var(--primary);
}

.btn-test--disabled {
  cursor: default;
  opacity: 0.5;
}

.btn {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 6px 12px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: var(--radius-pill);
  transition:
    background 0.15s,
    border-color 0.15s;
}

.btn--primary {
  font-weight: 600;
  color: var(--primary-foreground);
  background: var(--primary);
}

.btn--primary:hover {
  background: #4639d4;
}

.btn--outline {
  color: var(--foreground);
  background: var(--background);
  border: 1px solid var(--border);
}

.btn--outline:hover {
  border-color: var(--primary);
}

.btn--edit {
  color: var(--foreground);
  background: var(--background);
  border: 1px solid var(--border);
}

.btn--edit:hover {
  border-color: var(--primary);
}

/* ===== Info banner ===== */
.info-banner {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px;
  background: #c9d6f0;
  border: 1px solid #001133;
  border-radius: var(--radius-xl);
}

.info-icon {
  flex-shrink: 0;
  margin-top: 1px;
  color: #001133;
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-title {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #001133;
}

.info-desc {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #001133;
}
</style>
