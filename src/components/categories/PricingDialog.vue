<script
  setup
  lang="ts"
>
import { Info, X } from '@lucide/vue';
import { onMounted, onUnmounted, ref } from 'vue';

interface ServicePricing {
  serviceName: string;
  price: number;
  durationMinutes: number;
  notes: string;
  suggestedPriceLow: number;
  suggestedPriceHigh: number;
  suggestedDurationLow: number;
  suggestedDurationHigh: number;
}

const props = defineProps<{
  service: ServicePricing;
}>();

const emit = defineEmits<{
  close: [];
  save: [data: { price: number; durationMinutes: number; notes: string }];
}>();

const price = ref(props.service.price);
const durationMinutes = ref(props.service.durationMinutes);
const notes = ref(props.service.notes);

function onOverlayClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('dialog-overlay')) {
    emit('close');
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close');
  }
}

function onSave() {
  emit('save', {
    price: price.value,
    durationMinutes: durationMinutes.value,
    notes: notes.value,
  });
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <div
    class="dialog-overlay"
    @click="onOverlayClick"
  >
    <div class="dialog">
      <!-- Header -->
      <div class="dialog-header">
        <span class="dialog-title"
          >Edit pricing — {{ service.serviceName }}</span
        >
        <button
          class="close-btn"
          type="button"
          @click="emit('close')"
        >
          <X
            :size="18"
            color="#616167"
          />
        </button>
      </div>

      <!-- Body -->
      <div class="dialog-body">
        <div class="form-row">
          <div class="form-group">
            <label
              class="form-label"
              for="price-input"
              >Price (UZS)</label
            >
            <input
              id="price-input"
              v-model.number="price"
              class="form-input"
              type="number"
              min="0"
              placeholder="Enter price"
            >
          </div>
          <div class="form-group">
            <label
              class="form-label"
              for="duration-input"
              >Duration (minutes)</label
            >
            <input
              id="duration-input"
              v-model.number="durationMinutes"
              class="form-input"
              type="number"
              min="0"
              placeholder="Enter duration"
            >
          </div>
        </div>

        <div class="form-group">
          <label
            class="form-label"
            for="notes-input"
            >Notes</label
          >
          <textarea
            id="notes-input"
            v-model="notes"
            class="form-textarea"
            placeholder="Additional notes about this service..."
            rows="3"
          />
        </div>

        <div class="info-banner">
          <Info
            :size="16"
            color="#5749F4"
          />
          <span>
            Suggested range:
            <strong
              >{{ service.suggestedPriceLow?.toLocaleString() ?? '-' }}
              –
              {{ service.suggestedPriceHigh?.toLocaleString() ?? '-' }}
              UZS</strong
            >
            ·
            <strong
              >{{ service.suggestedDurationLow ?? '-' }}
              – {{ service.suggestedDurationHigh ?? '-' }} min</strong
            >
          </span>
        </div>
      </div>

      <!-- Footer -->
      <div class="dialog-footer">
        <button
          class="btn-cancel"
          type="button"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          class="btn-save"
          type="button"
          @click="onSave"
        >
          Save changes
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(42, 41, 51, 0.5);
}

.dialog {
  display: flex;
  flex-direction: column;
  width: 560px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow:
    0 20px 60px rgba(42, 41, 51, 0.2),
    0 0 0 1px rgba(197, 197, 203, 0.3);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.dialog-title {
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #2a2933;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  cursor: pointer;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
}

.dialog-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #2a2933;
}

.form-input {
  box-sizing: border-box;
  width: 100%;
  padding: 10px 14px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #2a2933;
  outline: none;
  background: #ffffff;
  border: 1px solid #d9d9db;
  border-radius: 10px;
}

.form-input:focus {
  border-color: #5749f4;
  box-shadow: 0 0 0 2px rgba(87, 73, 244, 0.15);
}

.form-textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 10px 14px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #2a2933;
  resize: vertical;
  outline: none;
  background: #ffffff;
  border: 1px solid #d9d9db;
  border-radius: 10px;
}

.form-textarea:focus {
  border-color: #5749f4;
  box-shadow: 0 0 0 2px rgba(87, 73, 244, 0.15);
}

.info-banner {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #616167;
  background: #f5f5ff;
  border-radius: 10px;
}

.dialog-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
}

.btn-cancel {
  padding: 10px 20px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #616167;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #d9d9db;
  border-radius: 10px;
}

.btn-save {
  padding: 10px 20px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  background: #5749f4;
  border: none;
  border-radius: 10px;
}

.btn-save:hover {
  background: #4638e0;
}
</style>
