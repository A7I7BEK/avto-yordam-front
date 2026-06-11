# Component Prompt: Pricing Dialog (Modal)

> **Design Node ID**: `b7mEUh`
> **Component Name**: Pricing Dialog — "24 — Pricing Dialog"
> **Component File**: `src/components/categories/PricingDialog.vue`
> **Usage**: Opened from the Service Categories page when "Edit pricing" is clicked on a service card

---

## 1. Overview

The Pricing Dialog is a modal overlay that lets business owners edit the price, duration, and master notes for a specific service. It appears centered over the dimmed categories page. It shows the current values, platform-suggested ranges, and a notes textarea for instructions to mechanics.

---

## 2. Modal Structure

```
┌─────────────────────────────────────────────────┐
│ Edit pricing — Brake pads exchange        [✕]   │ ← Header
│ Engine · Curated subcategory · Visible to drivers│
├─────────────────────────────────────────────────┤
│                                                  │
│ Price                                            │ ← Price field
│ ┌──────────────────────────────────────────┐    │
│ │ 850 000                            UZS   │    │
│ └──────────────────────────────────────────┘    │
│                                                  │
│ Duration                                         │ ← Duration field
│ ┌──────────────────────────────────────────┐    │
│ │ 90                                 min   │    │
│ └──────────────────────────────────────────┘    │
│                                                  │
│ Notes for masters                                │ ← Notes textarea
│ ┌──────────────────────────────────────────┐    │
│ │ Inspect rotors for scoring; replace if   │    │
│ │ below spec. Use OEM-grade pads for       │    │
│ │ premium tier customers. Always road-test │    │
│ │ after fitment.                           │    │
│ └──────────────────────────────────────────┘    │
│                                                  │
│ ┌──────────────────────────────────────────┐    │
│ │ ℹ Suggested platform range:             │    │ ← Info banner
│ │   700 000 — 1 100 000 UZS · 60–120 min  │    │
│ └──────────────────────────────────────────┘    │
├─────────────────────────────────────────────────┤
│                        [Cancel]  [Save changes] │ ← Footer
└─────────────────────────────────────────────────┘
```

---

## 3. Overlay

Behind the modal, the page content is dimmed with a semi-transparent overlay:

```css
.pricing-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4); /* #0F172A66 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
```

The overlay has the page content behind it at `opacity: 0.4` (the design shows the categories page visible but dimmed).

---

## 4. Modal Container

```css
.pricing-dialog {
  width: 560px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  background: #FFFFFF;
  border: 1px solid #C5C5CB;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.24);
  overflow: hidden;
  z-index: 101;
}
```

---

## 5. Modal Header

Padding: 24px 24px 8px 24px. Space-between layout.

### Left Side (vertical, gap 6px)

**Title**:
- "Edit pricing — {serviceName}" (e.g. "Edit pricing — Brake pads exchange")
- Inter 18px 700, `#2A2933`

**Subtitle**:
- "{category} · Curated subcategory · Visible to drivers" (e.g. "Engine · Curated subcategory · Visible to drivers")
- Inter 13px normal, `#616167`

### Right Side — Close Button

- 32×32px circle, `#F5F5F5` bg, radius 999
- `x` icon (Lucide), 16px, `#2A2933`
- Click emits `close` event

```vue
<button class="close-btn" @click="$emit('close')" aria-label="Close dialog">
  <X :size="16" />
</button>
```

---

## 6. Modal Body

Padding: 8px 24px 24px 24px. Vertical layout, gap 18px, scrollable if needed.

### 6.1 Price Field

**Label**: "Price" — Inter 13px 500, `#2A2933`, margin-bottom 6px.

**Input row**: Horizontal, space-between, padding 12px 16px, radius 14px, white bg, border 1.5px `#C5C5CB`.

```
┌──────────────────────────────┐
│ 850 000                UZS   │
└──────────────────────────────┘
```

- Value: Inter 15px 600, `#2A2933`, editable number input
- Currency label: "UZS" — Inter 13px 500, `#616167`
- Gap: 8px between value and label
- The input should be a number field, formatted with spaces (e.g. "850 000")

### 6.2 Duration Field

**Label**: "Duration" — Inter 13px 500, `#2A2933`, margin-bottom 6px.

```
┌──────────────────────────────┐
│ 90                       min │
└──────────────────────────────┘
```

- Same styling as price field
- Value: Inter 15px 600, `#2A2933`, editable number input
- Unit label: "min" — Inter 13px 500, `#616167`

### 6.3 Notes for Masters (Textarea)

**Label**: "Notes for masters" — Inter 13px 500, `#2A2933`, margin-bottom 6px.

```css
.notes-textarea {
  width: 100%;
  height: 110px;
  padding: 14px;
  border-radius: 14px;
  background: #FFFFFF;
  border: 1.5px solid #C5C5CB;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #2A2933;
  line-height: 1.5;
  resize: vertical;
  outline: none;
}
.notes-textarea:focus {
  border-color: #5749F4;
}
```

Placeholder: "Add instructions for masters performing this service..."

### 6.4 Info Banner

```css
.info-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #C9D6F0;
}
```

- `info` icon (Lucide), 14px, `#001133`
- Text: "Suggested platform range: {priceLow} — {priceHigh} UZS · {durationLow}–{durationHigh} min"
  - Example: "Suggested platform range: 700 000 — 1 100 000 UZS · 60–120 min"
  - Inter 12px 500, `#001133`

The suggested range changes per service. Define ranges in service data.

---

## 7. Modal Footer

Padding: 16px 24px 24px 24px. Top border: 1px `#C5C5CB`. Buttons right-aligned.

### Cancel Button

```css
.btn-cancel {
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid #C5C5CB;
  background: transparent;
  color: #2A2933;
  font: Inter 13px 500;
  cursor: pointer;
}
.btn-cancel:hover { background: #F5F5F5; }
```

### Save Button

```css
.btn-save {
  padding: 10px 18px;
  border-radius: 999px;
  border: none;
  background: #5749F4;
  color: #FFFFFF;
  font: Inter 13px 600;
  cursor: pointer;
}
.btn-save:hover { background: #4638E0; }
```

- Gap between buttons: 8px
- Both buttons are in a flex container with `justify-content: flex-end`

---

## 8. Component Interface

```typescript
// src/components/categories/PricingDialog.vue

defineProps<{
  /** The service being edited */
  service: {
    id: string;
    name: string;
    category: string;
    price: number | null;
    durationMinutes: number;
    notes: string;
    suggestedPriceLow: number;
    suggestedPriceHigh: number;
    suggestedDurationLow: number;
    suggestedDurationHigh: number;
  };
}>();

defineEmits<{
  close: [];
  save: [data: { price: number; duration: number; notes: string }];
}>();
```

---

## 9. Vue Component

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue';
import { X, Info } from 'lucide-vue-next';

const props = defineProps<{ /* ... */ }>();
const emit = defineEmits<{ close: []; save: [data: { price: number; duration: number; notes: string }] }>();

const form = reactive({
  price: props.service.price ?? 0,
  duration: props.service.durationMinutes,
  notes: props.service.notes,
});

function handleSave() {
  emit('save', { ...form });
}

// Format number with spaces for display
function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Close on Escape key
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close');
}
</script>

<template>
  <div class="pricing-dialog-overlay" @click.self="$emit('close')" @keydown="onKeydown">
    <div class="pricing-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <!-- Header -->
      <div class="dialog-header">
        <div class="dialog-header__info">
          <h2 id="dialog-title" class="dialog-title">Edit pricing — {{ service.name }}</h2>
          <p class="dialog-subtitle">{{ service.category }} · Curated subcategory · Visible to drivers</p>
        </div>
        <button class="dialog-close" @click="$emit('close')" aria-label="Close dialog">
          <X :size="16" />
        </button>
      </div>

      <!-- Body -->
      <div class="dialog-body">
        <!-- Price -->
        <div class="field">
          <label class="field__label">Price</label>
          <div class="field__input-row">
            <input
              v-model.number="form.price"
              type="number"
              class="field__input"
              min="0"
              step="10000"
            />
            <span class="field__unit">UZS</span>
          </div>
        </div>

        <!-- Duration -->
        <div class="field">
          <label class="field__label">Duration</label>
          <div class="field__input-row">
            <input
              v-model.number="form.duration"
              type="number"
              class="field__input"
              min="5"
              step="5"
            />
            <span class="field__unit">min</span>
          </div>
        </div>

        <!-- Notes -->
        <div class="field">
          <label class="field__label">Notes for masters</label>
          <textarea
            v-model="form.notes"
            class="field__textarea"
            placeholder="Add instructions for masters performing this service..."
          />
        </div>

        <!-- Info banner -->
        <div class="info-banner">
          <Info :size="14" />
          <span>
            Suggested platform range:
            {{ formatNumber(service.suggestedPriceLow) }} —
            {{ formatNumber(service.suggestedPriceHigh) }} UZS ·
            {{ service.suggestedDurationLow }}–{{ service.suggestedDurationHigh }} min
          </span>
        </div>
      </div>

      <!-- Footer -->
      <div class="dialog-footer">
        <button class="btn-cancel" @click="$emit('close')">Cancel</button>
        <button class="btn-save" @click="handleSave">Save changes</button>
      </div>
    </div>
  </div>
</template>
```

---

## 10. Styles

```css
/* Overlay */
.pricing-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

/* Dialog */
.pricing-dialog {
  width: 560px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  background: #FFFFFF;
  border: 1px solid #C5C5CB;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.24);
  overflow: hidden;
}

/* Header */
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 24px 8px 24px;
}

.dialog-header__info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dialog-title {
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #2A2933;
  margin: 0;
}

.dialog-subtitle {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #616167;
  margin: 0;
}

.dialog-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 999px;
  background: #F5F5F5;
  color: #2A2933;
  cursor: pointer;
  flex-shrink: 0;
}

.dialog-close:hover {
  background: #E8E8E8;
}

/* Body */
.dialog-body {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 8px 24px 24px 24px;
  overflow-y: auto;
}

/* Fields */
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field__label {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #2A2933;
}

.field__input-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 14px;
  background: #FFFFFF;
  border: 1.5px solid #C5C5CB;
}

.field__input-row:focus-within {
  border-color: #5749F4;
}

.field__input {
  flex: 1;
  border: none;
  outline: none;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #2A2933;
  background: transparent;
}

.field__input::-webkit-inner-spin-button,
.field__input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.field__unit {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #616167;
  flex-shrink: 0;
}

.field__textarea {
  width: 100%;
  height: 110px;
  padding: 14px;
  border-radius: 14px;
  background: #FFFFFF;
  border: 1.5px solid #C5C5CB;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #2A2933;
  line-height: 1.5;
  resize: vertical;
  outline: none;
}

.field__textarea:focus {
  border-color: #5749F4;
}

/* Info Banner */
.info-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #C9D6F0;
  color: #001133;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
}

/* Footer */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px 24px 24px;
  border-top: 1px solid #C5C5CB;
}

.btn-cancel {
  display: flex;
  align-items: center;
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid #C5C5CB;
  background: transparent;
  color: #2A2933;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.btn-cancel:hover {
  background: #F5F5F5;
}

.btn-save {
  display: flex;
  align-items: center;
  padding: 10px 18px;
  border-radius: 999px;
  border: none;
  background: #5749F4;
  color: #FFFFFF;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-save:hover {
  background: #4638E0;
}
```

---

## 11. Data Integration

When the dialog opens, it receives the full service object. On save, it emits the updated `{ price, duration, notes }` back to the parent, which updates the service in the data store.

```typescript
// In Categories.vue
const editingService = computed(() =>
  allServices.find(s => s.id === editingServiceId.value) ?? null
);

const suggestedRange = computed(() => {
  const svc = editingService.value;
  if (!svc) return { priceLow: 0, priceHigh: 0, durLow: 0, durHigh: 0 };
  // These could come from the service data or be calculated
  return {
    priceLow: Math.round((svc.price ?? 0) * 0.82),
    priceHigh: Math.round((svc.price ?? 0) * 1.29),
    durLow: Math.round(svc.durationMinutes * 0.67),
    durHigh: Math.round(svc.durationMinutes * 1.33),
  };
});
```

---

## 12. Accessibility Notes

- `role="dialog"` and `aria-modal="true"` on the dialog container
- `aria-labelledby` pointing to the title `h2`
- Focus trap inside the modal (focus cycles between inputs and buttons)
- Close on Escape key
- Close on overlay click (click outside the dialog)
- Return focus to the "Edit pricing" button that opened the dialog on close

---

## 13. Navigation Connection

- This dialog is a child of the Categories page (`/business/categories`)
- It does not have its own route — it's a modal overlay
- The sidebar **Categories** nav item remains active while the dialog is open
- After save, the service card on the parent page updates to reflect new values
