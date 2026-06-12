# Page Prompt: Service Categories

> **Design Node ID**: `y7a7t`
> **Page Name**: Service Categories
> **Route**: `/business/categories`
> **View File**: `src/views/business/Categories.vue`
> **Uses Layout**: `AppShell.vue` (with Business sidebar + header from `01-layouts-components`)

---

## 1. Overview

The Service Categories page lets business owners manage which platform services they offer and at what price. It uses a two-column layout: a category tree panel on the left for navigation, and a service list on the right showing individual services under the selected category. Each service has an enable/disable toggle and an "Edit pricing" button that opens the Pricing Dialog (see `02-pricing-dialog.md`).

---

## 2. Page Layout (Inside AppShell Content Area)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Home > Categories                                      ← Breadcrumb       │
│ Service Categories  [Curated by platform]     [✓ 24 services enabled]    │
├──────────────────────────────────────────────────────────────────────────┤
│ [🔍 Search services...]  [▼ All statuses]  [▼ Sort: Name A–Z] ← Toolbar │
├────────────┬─────────────────────────────────────────────────────────────┤
│ Categories │  ┌──────────────────────────────────────────────────────┐   │
│            │  │ Brake pads exchange                         850K UZS│   │
│ Engine  14 │  │ Front + rear pad set, pressure check      ⏱ 90 min │   │
│ Transm.  9 │  │ ────────────────────────────────────────────────── │   │
│ Chassis 12 │  │ [🟣 Enabled]                   [✏ Edit pricing]    │   │
│ Bodywork 7 │  └──────────────────────────────────────────────────────┘   │
│ Paint    5 │  ┌──────────────────────────────────────────────────────┐   │
│ Electr. 11 │  │ Engine oil change                       Not offered  │   │
│ Diagnost.8 │  │ Drain, filter swap, top-up to spec       ⏱ 45 min   │   │
│ Tires    6 │  │ ────────────────────────────────────────────────── │   │
│ A/C      4 │  │ [⚪ Disabled]                   [✏ Edit pricing]    │   │
│ Glass    3 │  └──────────────────────────────────────────────────────┘   │
│            │  ┌──────────────────────────────────────────────────────┐   │
│  280px     │  │ Timing belt replace                    1 850 000 UZS│   │
│            │  │ Belt + tensioner + idler kit fitment     ⏱ 180 min  │   │
│            │  │ ────────────────────────────────────────────────── │   │
│            │  │ [🟣 Enabled]                   [✏ Edit pricing]    │   │
│            │  └──────────────────────────────────────────────────────┘   │
└────────────┴─────────────────────────────────────────────────────────────┘
```

---

## 3. Content Area Container

```css
.categories-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  overflow: hidden;
  height: 100%;
}
```

---

## 4. Header Section

### 4.1 Breadcrumb

```
Home > Categories
```

- "Home": Inter 13px normal, `#616167`
- Chevron-right icon: 14px, `#616167`
- "Categories": Inter 13px 500, `#2A2933`
- Gap: 8px between items

### 4.2 Title Row (space-between)

**Left side** (horizontal, gap 12px):
- Title: "Service Categories" — Inter 24px 700, `#2A2933`
- Curated badge: pill, radius 999, `#C9D6F0` bg, padding 6px 10px
  - `badge-info` icon 12px, `#001133`
  - "Curated by platform" — Inter 12px 600, `#001133`
  - Gap: 6px

**Right side**:
- Services status badge: pill, radius 999, `#A1E5A1` bg, padding 6px 10px
  - `circle-check` icon 12px, `#003300`
  - "24 services enabled" — Inter 12px 600, `#003300`
  - Gap: 6px

---

## 5. Toolbar

Horizontal bar, `#F5F5F5` bg, border 1px `#C5C5CB`, radius 12px, padding 10px 12px, gap 8px.

### 5.1 Search Input

```
[🔍 Search services...]
```

- Pill shape, radius 999, white bg, border 1px `#C5C5CB`, padding 8px 14px
- `search` icon 14px + placeholder text, gap 8px
- Placeholder: Inter 13px normal, `#616167`
- `flex: 1` (fills available space)

### 5.2 Filter Dropdown

```
[▼ All statuses]
```

- Pill shape, radius 999, white bg, border 1px `#C5C5CB`, padding 8px 14px
- `sliders-horizontal` icon 14px + label + `chevron-down` 14px, gap 6px
- Label: Inter 13px 500, `#2A2933`
- Dropdown options: "All statuses", "Enabled", "Disabled"

### 5.3 Sort Dropdown

```
[▼ Sort: Name A–Z]
```

- Pill shape, radius 999, white bg, border 1px `#C5C5CB`, padding 8px 14px
- `arrow-up-down` icon 14px + label + `chevron-down` 14px, gap 6px
- Label: Inter 13px 500, `#2A2933`
- Dropdown options: "Name A–Z", "Name Z–A", "Price: Low to High", "Price: High to Low", "Duration: Short to Long"

---

## 6. Two-Column Layout

```css
.categories-body {
  display: flex;
  gap: 16px;
  flex: 1;
  overflow: hidden;
}
```

---

## 7. Category Tree Panel (Left)

Width: **280px**. A card with categories list.

### 7.1 Container

```css
.category-tree {
  display: flex;
  flex-direction: column;
  width: 280px;
  flex-shrink: 0;
  border-radius: 16px;
  background: #FFFFFF;
  border: 1px solid #C5C5CB;
  overflow: hidden;
}
```

### 7.2 Tree Header

```
Categories
```

- Padding: 14px 16px
- Bottom border: 1px `#C5C5CB`
- Text: Inter 13px 700, `#2A2933`

### 7.3 Category List

Scrollable list, padding 8px, gap 2px between items.

### 7.4 Category Item

Each item: horizontal, space-between, padding 10px 12px, radius 10px.

```
Engine                            [14]
```

**Active item**:
- Background: `#F5F5F5`
- Name: Inter 13px 600, `#2A2933`
- Count badge: pill, radius 999, `#5749F4` bg, `#FFFFFF` text, padding 2px 8px
- Count font: Inter 11px 700

**Inactive item**:
- Background: transparent
- Name: Inter 13px 500, `#2A2933`
- Count badge: pill, radius 999, `#F5F5F5` bg, `#616167` text, padding 2px 8px
- Count font: Inter 11px 600

### 7.5 Category Data

```typescript
// src/data/categories.ts
export const categoryTree = [
  { name: 'Engine',       count: 14, isActive: true },
  { name: 'Transmission', count: 9,  isActive: false },
  { name: 'Chassis',      count: 12, isActive: false },
  { name: 'Bodywork',     count: 7,  isActive: false },
  { name: 'Paint',        count: 5,  isActive: false },
  { name: 'Electrical',   count: 11, isActive: false },
  { name: 'Diagnostics',  count: 8,  isActive: false },
  { name: 'Tires',        count: 6,  isActive: false },
  { name: 'A/C',          count: 4,  isActive: false },
  { name: 'Glass',        count: 3,  isActive: false },
];
```

### 7.6 Behavior

- Clicking a category selects it (highlights as active) and filters the service list on the right
- The count badge shows total services in that category
- Active count badge becomes purple; inactive stay gray

---

## 8. Service List (Right)

Scrollable area showing service cards for the selected category.

### 8.1 Container

```css
.service-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}
```

### 8.2 Service Card

Each card: border 1px `#C5C5CB`, radius 16px, padding 16px, white bg, gap 12px vertical.

```
┌─────────────────────────────────────────────┐
│ Brake pads exchange                850K UZS │ ← head
│ Front + rear pad set, pressure check⏱90 min │ ← meta
│ ─────────────────────────────────────────── │ ← divider
│ [🟣 Enabled]              [✏ Edit pricing] │ ← foot
└─────────────────────────────────────────────┘
```

### 8.3 Card Sections

**Head** (vertical, gap 4px):
- Service name: Inter 14px 600, `#2A2933`
- Description: Inter 12px normal, `#616167`

**Meta** (space-between, gap 12px):
- Duration: `timer` icon 12px + "90 min" — Inter 12px 500, `#616167`, gap 4px
- Price: Inter 13px 700, `#2A2933` — OR "Not offered" Inter 12px italic normal, `#616167` (for disabled services)

**Divider**: 1px `#C5C5CB`, full width

**Foot** (space-between):
- Toggle row: horizontal, gap 8px
  - **Enabled**: `switch/checked` component (36×20px, `#5749F4` bg, thumb at end) + "Enabled" Inter 12px 600, `#2A2933`
  - **Disabled**: `switch/unchecked` component (36×20px, `#C5C5CB` bg, thumb at start) + "Disabled" Inter 12px 500, `#616167`
- Edit button: pill, radius 999, white bg, border 1px `#C5C5CB`, padding 7px 12px, gap 6px
  - `pencil` icon 13px
  - "Edit pricing" — Inter 12px 600, `#2A2933`
  - Click opens the **Pricing Dialog** (see `02-pricing-dialog.md`)

### 8.4 Service Data

```typescript
export const services = [
  {
    id: 'svc-1',
    name: 'Brake pads exchange',
    description: 'Front + rear pad set, pressure check',
    durationMinutes: 90,
    price: 850000,
    enabled: true,
    category: 'Engine',
  },
  {
    id: 'svc-2',
    name: 'Engine oil change',
    description: 'Drain, filter swap, top-up to spec',
    durationMinutes: 45,
    price: null,          // "Not offered"
    enabled: false,
    category: 'Engine',
  },
  {
    id: 'svc-3',
    name: 'Timing belt replace',
    description: 'Belt + tensioner + idler kit fitment',
    durationMinutes: 180,
    price: 1850000,
    enabled: true,
    category: 'Engine',
  },
  {
    id: 'svc-4',
    name: 'Spark plug replacement',
    description: 'Iridium plugs, gap check, torque spec',
    durationMinutes: 60,
    price: 450000,
    enabled: true,
    category: 'Engine',
  },
  {
    id: 'svc-5',
    name: 'Engine diagnostics',
    description: 'OBD scan, live data, compression test',
    durationMinutes: 60,
    price: 350000,
    enabled: true,
    category: 'Engine',
  },
  // ... more services for other categories
];
```

---

## 9. Toggle Switch Component

The toggle switch is a reusable component. Two states:

**Enabled** (checked):
```css
.toggle--enabled {
  width: 36px;
  height: 20px;
  border-radius: 999px;
  background: #5749F4;
  padding: 2px;
  justify-content: flex-end; /* thumb at right */
}
.toggle--enabled .toggle__thumb {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #FFFFFF;
}
```

**Disabled** (unchecked):
```css
.toggle--disabled {
  background: #C5C5CB;
  justify-content: flex-start; /* thumb at left */
}
```

The switch is 36×20px with a 16×16px white thumb. Use a button with `role="switch"` and `aria-checked`.

```vue
<!-- src/components/app/ToggleSwitch.vue -->
<script setup lang="ts">
defineProps<{ modelValue: boolean }>();
defineEmits<{ 'update:modelValue': [value: boolean] }>();
</script>

<template>
  <button
    role="switch"
    :aria-checked="modelValue"
    class="toggle"
    :class="modelValue ? 'toggle--enabled' : 'toggle--disabled'"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span class="toggle__thumb" />
  </button>
</template>
```

---

## 10. Filtering & Search Logic

The service list is filtered by:
1. **Selected category** (from left tree panel)
2. **Search query** (from search input)
3. **Status filter** (All / Enabled / Disabled)
4. **Sort order** (Name A–Z, Price, Duration)

```typescript
import { computed, ref } from 'vue';

const selectedCategory = ref('Engine');
const searchQuery = ref('');
const statusFilter = ref<'all' | 'enabled' | 'disabled'>('all');
const sortOrder = ref<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'duration-asc' | 'duration-desc'>('name-asc');

const filteredServices = computed(() => {
  let result = allServices.filter(s => s.category === selectedCategory.value);

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }

  if (statusFilter.value === 'enabled') result = result.filter(s => s.enabled);
  if (statusFilter.value === 'disabled') result = result.filter(s => !s.enabled);

  // Sort
  result.sort((a, b) => {
    switch (sortOrder.value) {
      case 'name-asc': return a.name.localeCompare(b.name);
      case 'name-desc': return b.name.localeCompare(a.name);
      case 'price-asc': return (a.price ?? 0) - (b.price ?? 0);
      case 'price-desc': return (b.price ?? 0) - (a.price ?? 0);
      case 'duration-asc': return a.durationMinutes - b.durationMinutes;
      case 'duration-desc': return b.durationMinutes - a.durationMinutes;
      default: return 0;
    }
  });

  return result;
});
```

---

## 11. Edit Pricing Flow

When "Edit pricing" is clicked:
1. Emit `edit-pricing` event with the service ID
2. Parent opens the Pricing Dialog modal (see `02-pricing-dialog.md`)
3. On save, update the service data and refresh the list

---

## 12. Component Tree

```
Categories.vue
├── BreadcrumbBar.vue               ← Home > Categories
├── HeaderRow.vue                   ← Title + badges
├── Toolbar.vue                     ← Search + Filter + Sort
│   ├── SearchInput.vue
│   ├── FilterDropdown.vue
│   └── SortDropdown.vue
├── CategoriesBody.vue              ← Two-column container
│   ├── CategoryTree.vue            ← Left 280px panel
│   │   ├── TreeHeader.vue          ← "Categories" title
│   │   └── CategoryItem.vue ×10    ← Individual category row
│   └── ServiceList.vue             ← Right content area
│       └── ServiceCard.vue ×N      ← Individual service card
│           ├── ServiceHead.vue      ← Name + description
│           ├── ServiceMeta.vue      ← Duration + price
│           ├── ToggleSwitch.vue     ← Enable/disable
│           └── EditPricingButton.vue ← Opens pricing dialog
└── PricingDialog.vue               ← Modal (conditional, from 02-pricing-dialog.md)
```

---

## 13. Vue Component Outline

### File: `src/views/business/Categories.vue`

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { categoryTree, allServices } from '@/data/categories';
import CategoryTree from '@/components/categories/CategoryTree.vue';
import ServiceList from '@/components/categories/ServiceList.vue';
import PricingDialog from '@/components/categories/PricingDialog.vue';
import Toolbar from '@/components/categories/Toolbar.vue';

const selectedCategory = ref('Engine');
const searchQuery = ref('');
const statusFilter = ref<'all' | 'enabled' | 'disabled'>('all');
const sortOrder = ref('name-asc');

const editingService = ref<string | null>(null); // service ID being edited

const filteredServices = computed(() => { /* ... filter logic ... */ });
const enabledCount = computed(() => allServices.filter(s => s.enabled).length);

function openPricingDialog(serviceId: string) {
  editingService.value = serviceId;
}
function closePricingDialog() {
  editingService.value = null;
}
function handleSave(updatedData: { price: number; duration: number; notes: string }) {
  // Update service in data store
  closePricingDialog();
}
</script>

<template>
  <div class="categories-page">
    <BreadcrumbBar :items="['Home', 'Categories']" />
    <HeaderRow :enabled-count="enabledCount" />
    <Toolbar v-model:search="searchQuery" v-model:status="statusFilter" v-model:sort="sortOrder" />
    <div class="categories-body">
      <CategoryTree
        :categories="categoryTree"
        v-model:selected="selectedCategory"
      />
      <ServiceList
        :services="filteredServices"
        @edit-pricing="openPricingDialog"
        @toggle="handleToggle"
      />
    </div>
    <PricingDialog
      v-if="editingService"
      :service-id="editingService"
      @close="closePricingDialog"
      @save="handleSave"
    />
  </div>
</template>
```

---

## 14. Mock Data File

```typescript
// src/data/categories.ts

export interface CategoryNode {
  name: string;
  count: number;
  isActive: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number | null;
  enabled: boolean;
  category: string;
  notes?: string;
}

export const categoryTree: CategoryNode[] = [
  { name: 'Engine', count: 14, isActive: true },
  { name: 'Transmission', count: 9, isActive: false },
  { name: 'Chassis', count: 12, isActive: false },
  { name: 'Bodywork', count: 7, isActive: false },
  { name: 'Paint', count: 5, isActive: false },
  { name: 'Electrical', count: 11, isActive: false },
  { name: 'Diagnostics', count: 8, isActive: false },
  { name: 'Tires', count: 6, isActive: false },
  { name: 'A/C', count: 4, isActive: false },
  { name: 'Glass', count: 3, isActive: false },
];

export const allServices: ServiceItem[] = [
  {
    id: 'svc-1', name: 'Brake pads exchange',
    description: 'Front + rear pad set, pressure check',
    durationMinutes: 90, price: 850000, enabled: true, category: 'Engine',
    notes: 'Inspect rotors for scoring; replace if below spec. Use OEM-grade pads for premium tier customers. Always road-test after fitment.',
  },
  {
    id: 'svc-2', name: 'Engine oil change',
    description: 'Drain, filter swap, top-up to spec',
    durationMinutes: 45, price: null, enabled: false, category: 'Engine',
    notes: '',
  },
  {
    id: 'svc-3', name: 'Timing belt replace',
    description: 'Belt + tensioner + idler kit fitment',
    durationMinutes: 180, price: 1850000, enabled: true, category: 'Engine',
    notes: 'Always replace water pump simultaneously. Verify timing marks after 2 full rotations.',
  },
  {
    id: 'svc-4', name: 'Spark plug replacement',
    description: 'Iridium plugs, gap check, torque spec',
    durationMinutes: 60, price: 450000, enabled: true, category: 'Engine',
    notes: 'Check coil packs for cracks. Apply dielectric grease to boots.',
  },
  {
    id: 'svc-5', name: 'Engine diagnostics',
    description: 'OBD scan, live data, compression test',
    durationMinutes: 60, price: 350000, enabled: true, category: 'Engine',
    notes: 'Clear codes before scanning. Document all readings for customer report.',
  },
];
```

---

## 15. Navigation Connection

- Sidebar **Categories** nav item is **active** when on this page
- Clicking "Edit pricing" opens the Pricing Dialog (see `02-pricing-dialog.md`)
- Toggling a service enable/disable updates the "24 services enabled" badge count
- Breadcrumb: Home > Categories
- Home links to `/business/dashboard`

---

## 16. Service Layer Pattern

```typescript
// src/services/categoriesService.ts
import { isMockMode } from '@/config';
import { categoryTree, allServices } from '@/data/categories';

export async function getCategories() {
  if (isMockMode()) return { categories: categoryTree, services: allServices };
  return apiClient.get('/business/categories');
}

export async function updateServicePricing(serviceId: string, data: { price: number; duration: number; notes: string }) {
  if (isMockMode()) {
    const svc = allServices.find(s => s.id === serviceId);
    if (svc) { svc.price = data.price; svc.durationMinutes = data.duration; svc.notes = data.notes; }
    return { success: true };
  }
  return apiClient.put(`/business/categories/services/${serviceId}/pricing`, data);
}

export async function toggleService(serviceId: string, enabled: boolean) {
  if (isMockMode()) {
    const svc = allServices.find(s => s.id === serviceId);
    if (svc) svc.enabled = enabled;
    return { success: true };
  }
  return apiClient.patch(`/business/categories/services/${serviceId}/toggle`, { enabled });
}
```


**Screenshot**: `01-service-categories.png`
