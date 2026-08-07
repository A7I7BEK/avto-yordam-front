<script
  setup
  lang="ts"
>
import {
  CircleCheck,
  CircleX,
  Eye,
  EyeOff,
  Info,
  LoaderCircle,
  Pencil,
  Play,
  Plus,
} from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import {
  createSettingsPayment,
  getPaymentProviders,
  getSettingsPayment,
  updateSettingsPayment,
} from '@/services/settingsService';
import type {
  OrganizationPaymentProviderRequest,
  PaymentProviderFieldResponse,
  PaymentProviderResponse,
  PaymentProviderType,
} from '@/types/settings';

interface ProviderField {
  name: string;
  label: string;
  value: string;
  secret?: boolean;
  required?: boolean;
  placeHolder?: string;
}

interface Provider {
  id: string;
  type: PaymentProviderType;
  typeKey: string;
  name: string;
  enabled: boolean;
  logoUrl: string;
  fields: ProviderField[];
  lastCharge: string;
  hasActivity: boolean;
}

interface ProviderTypeInfo {
  typeKey: string;
  type: PaymentProviderType;
  name: string;
  logoUrl: string;
  fee: string;
  fieldDefs: PaymentProviderFieldResponse[];
}

const providers = ref<Provider[]>([]);
const orgId = ref<string | null>(null);const loading = ref(true);
const savingProviders = ref<Record<string, boolean>>({});
const addingProviderKey = ref<string | null>(null);
const addingFieldValues = ref<Record<string, string>>({});
const savingAdd = ref(false);

const providerFees: Record<string, string> = {
  payme: '2.5%',
  click: '2.0%',
  paynet: '3.0%',
  uzum: '2.0%',
};

const lastChargeTexts: Record<string, string> = {
  payme: 'Last charge: 2 min ago',
  click: 'Last charge: 27 min ago',
  paynet: 'Never used',
  uzum: 'Never used',
};

const providersList = ref<PaymentProviderResponse[]>([]);

const allProviderTypes = computed<ProviderTypeInfo[]>(() =>
  providersList.value
    .filter((p) => p.code !== 'CASH')
    .map((p) => ({
      typeKey: p.code.toLowerCase(),
      type: p.code as PaymentProviderType,
      name: p.displayName,
      logoUrl: p.logoUrl,
      fee: providerFees[p.code.toLowerCase()] ?? '',
      fieldDefs: p.fields,
    })),
);

const configuredTypes = computed(() => new Set(providers.value.map((p) => p.typeKey)));

const availableTypes = computed(() =>
  allProviderTypes.value.filter((t) => !configuredTypes.value.has(t.typeKey)),
);

const addingProviderData = computed(() =>
  allProviderTypes.value.find((t) => t.typeKey === addingProviderKey.value) ?? null,
);

const MASKED_VALUE = '•••••••••••••••••••';

function getDisplayValue(field: ProviderField, revealed: boolean): string {
  if (!field.secret) {
    return field.value;
  }
  return revealed ? field.value : MASKED_VALUE;
}

function onSecretInput(event: Event, field: ProviderField) {
  const target = event.target as HTMLInputElement;
  field.value = target.value;
}

const revealedKeys = ref<Record<string, boolean>>({});
const editingProviders = ref<Record<string, boolean>>({});
const savedFields = ref<Record<string, string>>({});

/**
 * Parse the credentials JSON string from the API into a record of field values.
 */
function parseCredentials(credentials: string | null): Record<string, string> {
  if (!credentials) {
    return {};
  }
  try {
    return JSON.parse(credentials);
  } catch {
    return {};
  }
}

/**
 * Serialize an array of fields into a credentials JSON string using field names as keys.
 */
function fieldsToCredentials(fields: ProviderField[]): string {
  const obj: Record<string, string> = {};
  for (const field of fields) {
    obj[field.name] = field.value;
  }
  return JSON.stringify(obj);
}

/**
 * Build ProviderField[] from field definitions + parsed credentials.
 */
function buildFields(
  fieldDefs: PaymentProviderFieldResponse[],
  parsedCredentials: Record<string, string>,
): ProviderField[] {
  return fieldDefs
    .sort((a, b) => a.orderNo - b.orderNo)
    .map((def) => ({
      name: def.name,
      label: def.label,
      value: parsedCredentials[def.name] ?? '',
      secret: def.type === 'password',
      required: def.required,
      placeHolder: def.placeHolder,
    }));
}

onMounted(async () => {
  const [masterProviders, orgProviders] = await Promise.all([
    getPaymentProviders(),
    getSettingsPayment(),
  ]);

  providersList.value = masterProviders;

  if (orgProviders) {
    providers.value = orgProviders
      .filter((p) => p.type !== 'CASH')
      .map((p) => {
        const typeKey = p.type.toLowerCase();
        const master = masterProviders.find(
          (m) => m.code === p.type,
        );
        const parsedCredentials = parseCredentials(p.credentials);
        const fields = buildFields(
          master?.fields ?? [],
          parsedCredentials,
        );

        return {
          id: p.id,
          type: p.type,
          typeKey,
          name: master?.displayName ?? typeKey.charAt(0).toUpperCase() + typeKey.slice(1),
          enabled: p.enabled,
          logoUrl: master?.logoUrl ?? '',
          fields,
          lastCharge: lastChargeTexts[typeKey] ?? 'Never used',
          hasActivity: p.enabled && typeKey !== 'paynet',
        };
      });
  }

  loading.value = false;
});

function startAddingProvider(typeInfo: ProviderTypeInfo) {
  addingProviderKey.value = typeInfo.typeKey;
  // Initialize field values from field definitions (all empty)
  const initial: Record<string, string> = {};
  for (const def of typeInfo.fieldDefs) {
    initial[def.name] = '';
  }
  addingFieldValues.value = initial;
}

function cancelAddingProvider() {
  addingProviderKey.value = null;
  addingFieldValues.value = {};
}

async function confirmAddingProvider(typeInfo: ProviderTypeInfo) {
  if (addingProviderKey.value !== typeInfo.typeKey || savingAdd.value) {
    return;
  }

  savingAdd.value = true;

  try {
    const credentials = JSON.stringify(addingFieldValues.value);

    const response = await createSettingsPayment({
      type: typeInfo.type,
      credentials,
      enabled: true,
    });

    const parsedCredentials = parseCredentials(response.credentials);
    const fields = buildFields(typeInfo.fieldDefs, parsedCredentials);

    providers.value.push({
      id: response.id,
      type: response.type,
      typeKey: typeInfo.typeKey,
      name: typeInfo.name,
      enabled: response.enabled,
      logoUrl: typeInfo.logoUrl,
      fields,
      lastCharge: lastChargeTexts[typeInfo.typeKey] ?? 'Never used',
      hasActivity: false,
    });

    addingProviderKey.value = null;
    addingFieldValues.value = {};
  } catch {
    // Error toast could be added here
  } finally {
    savingAdd.value = false;
  }
}

async function toggleProvider(id: string) {
  const provider = providers.value.find((p) => p.id === id);
  if (!provider) {
    return;
  }

  const newEnabled = !provider.enabled;
  provider.enabled = newEnabled;
  if (provider.typeKey === 'paynet') {
    provider.hasActivity = newEnabled;
  }

  savingProviders.value[id] = true;
  try {
    await updateSettingsPayment(id, {
      type: provider.type,
      credentials: fieldsToCredentials(provider.fields),
      enabled: newEnabled,
    });
  } catch {
    // Revert on failure
    provider.enabled = !newEnabled;
  } finally {
    savingProviders.value[id] = false;
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
    if (field.secret) {
      revealedKeys.value[`${providerId}-${index}`] = true;
    }
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
    if (field.secret) {
      revealedKeys.value[`${providerId}-${index}`] = false;
    }
  }
  editingProviders.value[providerId] = false;
}

async function saveEditing(providerId: string) {
  const provider = providers.value.find((p) => p.id === providerId);
  if (!provider) {
    return;
  }

  savingProviders.value[providerId] = true;

  try {
    await updateSettingsPayment(provider.id, {
      type: provider.type,
      credentials: fieldsToCredentials(provider.fields),
      enabled: provider.enabled,
    });

    for (const [index, field] of provider.fields.entries()) {
      if (field.secret) {
        revealedKeys.value[`${providerId}-${index}`] = false;
      }
    }
    editingProviders.value[providerId] = false;
  } catch {
    // Error toast could be added here
  } finally {
    savingProviders.value[providerId] = false;
  }
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
                :src="provider.logoUrl"
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
            :disabled="savingProviders[provider.id]"
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
              :value="getDisplayValue(field, isRevealed(provider.id, index))"
              type="text"
              class="field-input"
              :class="{
                'field-input--empty': field.value === 'Not configured',
              }"
              :disabled="!isEditing(provider.id)"
              @input="onSecretInput($event, field)"
            >
            <button
              type="button"
              class="field-eye-btn"
              :aria-label="isRevealed(provider.id, index) ? 'Hide secret key' : 'Show secret key'"
              @click="toggleReveal(provider.id, index)"
            >
              <EyeOff
                v-if="isRevealed(provider.id, index)"
                :size="14"
                class="field-eye-icon"
              />
              <Eye
                v-else
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
                :disabled="savingProviders[provider.id]"
                @click="cancelEditing(provider.id)"
              >
                <CircleX :size="13" />
                Cancel
              </button>
              <button
                type="button"
                class="btn btn--primary"
                :disabled="savingProviders[provider.id]"
                @click="saveEditing(provider.id)"
              >
                <LoaderCircle
                  v-if="savingProviders[provider.id]"
                  :size="13"
                  class="btn-spinner"
                />
                <CircleCheck
                  v-else
                  :size="13"
                />
                {{ savingProviders[provider.id] ? 'Saving…' : 'Save' }}
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

      <!-- Add provider cards for unconfigured types -->
      <div
        v-for="typeInfo in availableTypes"
        :key="typeInfo.typeKey"
        class="provider-card provider-card--add"
      >
        <div class="provider-add-content">
          <div class="provider-icon">
            <img
              :src="typeInfo.logoUrl"
              :alt="typeInfo.name"
              class="provider-icon-img"
            >
          </div>
          <span class="provider-name">{{ typeInfo.name }}</span>
          <span class="provider-fee">{{ typeInfo.fee }} per transaction</span>
          <button
            type="button"
            class="btn btn--primary btn--add"
            @click="startAddingProvider(typeInfo)"
          >
            <Plus :size="14" />
            Add
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: Add provider credentials -->
    <Teleport to="body">
      <div
        v-if="addingProviderData"
        class="modal-overlay"
        @click.self="cancelAddingProvider"
      >
        <div class="modal-content">
          <!-- Modal header -->
          <div class="modal-header">
            <div class="modal-header-left">
              <div class="provider-icon">
                <img
                  :src="addingProviderData.logoUrl"
                  :alt="addingProviderData.name"
                  class="provider-icon-img"
                >
              </div>
              <div class="provider-info">
                <span class="provider-name">{{ addingProviderData.name }}</span>
                <span class="provider-fee">{{ addingProviderData.fee }} per transaction</span>
              </div>
            </div>
            <button
              type="button"
              class="modal-close-btn"
              :disabled="savingAdd"
              @click="cancelAddingProvider"
            >
              <CircleX :size="18" />
            </button>
          </div>

          <div class="modal-divider" />

          <!-- Credential fields -->
          <div class="modal-body">
            <p class="modal-body-title">Configure credentials</p>
            <div
              v-for="def in addingProviderData.fieldDefs"
              :key="def.id"
              class="provider-field"
            >
              <label
                class="field-label"
                :for="`modal-${def.name}`"
              >{{ def.label }} <span v-if="def.required" class="field-required">*</span></label>
              <div
                v-if="def.type === 'password'"
                class="field-input-wrap"
              >
                <input
                  :id="`modal-${def.name}`"
                  v-model="addingFieldValues[def.name]"
                  type="text"
                  class="field-input"
                  :placeholder="def.placeHolder"
                >
              </div>
              <input
                v-else
                :id="`modal-${def.name}`"
                v-model="addingFieldValues[def.name]"
                type="text"
                class="field-input"
                :placeholder="def.placeHolder"
              >
            </div>
          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn--outline"
              :disabled="savingAdd"
              @click="cancelAddingProvider"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn--primary"
              :disabled="savingAdd"
              @click="confirmAddingProvider(addingProviderData)"
            >
              <LoaderCircle
                v-if="savingAdd"
                :size="14"
                class="btn-spinner"
              />
              <CircleCheck
                v-else
                :size="14"
              />
              {{ savingAdd ? 'Adding…' : 'Add provider' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

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

.provider-card--add {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  border-style: dashed;
  background: var(--accent);
}

.provider-add-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  text-align: center;
}

.btn--add {
  margin-top: 4px;
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

/* ===== Button spinner ===== */
.btn-spinner {
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===== Modal ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.45);
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
}

.modal-header-left {
  display: flex;
  gap: 10px;
  align-items: center;
}

.modal-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  color: var(--muted-foreground);
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 4px;
}

.modal-close-btn:hover:not(:disabled) {
  color: var(--foreground);
  background: var(--accent);
}

.modal-divider {
  height: 1px;
  background: var(--border);
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 24px;
}

.modal-body-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

.modal-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
}

.field-required {
  color: #e53e3e;
}
</style>
