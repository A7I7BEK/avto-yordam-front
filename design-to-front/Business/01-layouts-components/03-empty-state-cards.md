# Component Prompt: EmptyStateCard (Business)

> **Design Node ID**: `Mt4Rj`
> **Component File**: `src/components/app/EmptyStateCard.vue`
> **Purpose**: A reusable empty state card used across multiple Business pages to indicate no data yet
> **Variants**: 8 predefined configurations (see §5)

---

## 1. Overview

The EmptyStateCard is a consistent UI pattern used throughout the Business workspace when a list or table has no data. Each card has an icon, title, description, and optional action button. The component is fully configurable via props.

---

## 2. Anatomy

```
┌──────────────────────────────────────┐
│                                      │
│            ┌──────────┐              │  ← Icon circle (52×52px, #F5F5F5 bg)
│            │  🗓 icon  │              │     Icon: 24px, #616167
│            └──────────┘              │
│                                      │
│         No bookings yet              │  ← Title: Inter 14px, weight 600, #2A2933
│                                      │
│   Customers will appear here as      │  ← Description: Inter 12px, normal, #616167
│   soon as they request service.      │     centered, max-width ~240px
│                                      │
│       ┌──────────────┐               │  ← Button (optional): pill shape,
│       │  Add walk-in  │               │     radius 999, padding 6px 14px
│       └──────────────┘               │     Primary or Outline variant
│                                      │
└──────────────────────────────────────┘
```

---

## 3. Container Styles

```css
.empty-state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 240px;
  width: 100%;
  padding: 24px;
  border-radius: 24px;
  background: #FFFFFF;
  border: 1px solid #C5C5CB;
}
```

### 3.1 Icon Circle

```css
.empty-state-card__icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 999px;
  background: #F5F5F5;
  flex-shrink: 0;
}
```

### 3.2 Title

```css
.empty-state-card__title {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #2A2933;
  text-align: center;
}
```

### 3.3 Description

```css
.empty-state-card__description {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #616167;
  text-align: center;
  max-width: 260px;
  line-height: 1.4;
}
```

### 3.4 Action Button

Two button variants exist in the design:

**Primary Button** (filled):
```css
.empty-state-card__button--primary {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border: none;
  border-radius: 999px;
  background: #5749F4;
  color: #FFFFFF;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.empty-state-card__button--primary:hover {
  background: #4638E0;
}
```

**Outline Button**:
```css
.empty-state-card__button--outline {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border: 1px solid #C5C5CB;
  border-radius: 999px;
  background: #FFFFFF;
  color: #2A2933;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.empty-state-card__button--outline:hover {
  background: #F5F5F5;
}
```

---

## 4. Component Interface

```typescript
// src/components/app/EmptyStateCard.vue
import type { Component } from 'vue';

defineProps<{
  /** Lucide icon component to display inside the circle */
  icon: Component;

  /** Card title, e.g. "No bookings yet" */
  title: string;

  /** Descriptive text, e.g. "Customers will appear here as soon as..." */
  description: string;

  /** Optional button label. If undefined, no button is rendered. */
  buttonLabel?: string;

  /** Button variant: 'primary' (filled purple) or 'outline' (white with border). Default: 'primary' */
  buttonVariant?: 'primary' | 'outline';
}>();

defineEmits<{
  /** Emitted when the action button is clicked */
  'button-click': [];
}>();
```

```vue
<template>
  <div class="empty-state-card">
    <div class="empty-state-card__icon-circle">
      <component :is="icon" :size="24" color="#616167" />
    </div>

    <h3 class="empty-state-card__title">{{ title }}</h3>

    <p class="empty-state-card__description">{{ description }}</p>

    <button
      v-if="buttonLabel"
      class="empty-state-card__button"
      :class="`empty-state-card__button--${buttonVariant ?? 'primary'}`"
      @click="$emit('button-click')"
    >{{ buttonLabel }}</button>
  </div>
</template>
```

---

## 5. Predefined Variant Configurations

The design specifies **8 empty state variants**. Create a static data file for these:

```typescript
// src/data/emptyStates.ts
import {
  CalendarDays,
  Users,
  Mail,
  Star,
  Package,
  Receipt,
  CreditCard,
  KeyRound,
} from 'lucide-vue-next';
import type { Component } from 'vue';

export interface EmptyStateConfig {
  id: string;
  icon: Component;
  title: string;
  description: string;
  buttonLabel?: string;
  buttonVariant?: 'primary' | 'outline';
}

export const emptyStates: EmptyStateConfig[] = [
  // ── Row 1 ──
  {
    id: 'no-bookings',
    icon: CalendarDays,
    title: 'No bookings yet',
    description: 'Customers will appear here as soon as they request service.',
    buttonLabel: 'Add walk-in',
    buttonVariant: 'primary',
  },
  {
    id: 'no-team',
    icon: Users,
    title: 'No team members yet',
    description: 'Invite masters and receptionists to start working together.',
    buttonLabel: 'Invite team member',
    buttonVariant: 'primary',
  },
  {
    id: 'no-invitations',
    icon: Mail,
    title: 'No invitations right now',
    description: 'Organizations will be able to find you in search as your rating grows.',
    buttonLabel: 'Edit public profile',
    buttonVariant: 'outline',
  },
  {
    id: 'no-reviews',
    icon: Star,
    title: 'No reviews yet',
    description: 'Customers can leave a review after their first completed order.',
    // No button
  },

  // ── Row 2 ──
  {
    id: 'no-services',
    icon: Package,
    title: 'No services selected',
    description: 'Pick services from the platform catalog to start receiving bookings.',
    buttonLabel: 'Open catalog',
    buttonVariant: 'primary',
  },
  {
    id: 'no-transactions',
    icon: Receipt,
    title: 'No transactions yet',
    description: 'Online and cash payments will be recorded here.',
    // No button
  },
  {
    id: 'no-organization',
    icon: CreditCard,
    title: 'You don\'t belong to any organization yet',
    description: 'Wait for an invitation or set up your own solo business.',
    buttonLabel: 'Set up solo work',
    buttonVariant: 'primary',
  },
  {
    id: 'no-roles',
    icon: KeyRound,
    title: 'No custom roles yet',
    description: 'Duplicate a built-in role or create one from scratch.',
    buttonLabel: 'Create role',
    buttonVariant: 'outline',
  },
];

/** Lookup an empty state by its ID */
export function getEmptyState(id: string): EmptyStateConfig | undefined {
  return emptyStates.find((e) => e.id === id);
}
```

---

## 6. Variant Details Reference

### Row 1 (4 cards displayed side-by-side in a 4-column grid)

| # | ID | Icon | Title | Description | Button |
|---|----|------|-------|-------------|--------|
| 1 | `no-bookings` | `calendar-days` | No bookings yet | Customers will appear here as soon as they request service. | **Add walk-in** (primary) |
| 2 | `no-team` | `users` | No team members yet | Invite masters and receptionists to start working together. | **Invite team member** (primary) |
| 3 | `no-invitations` | `mail` | No invitations right now | Organizations will be able to find you in search as your rating grows. | **Edit public profile** (outline) |
| 4 | `no-reviews` | `star` | No reviews yet | Customers can leave a review after their first completed order. | *(none)* |

### Row 2 (4 cards displayed side-by-side)

| # | ID | Icon | Title | Description | Button |
|---|----|------|-------|-------------|--------|
| 5 | `no-services` | `package` | No services selected | Pick services from the platform catalog to start receiving bookings. | **Open catalog** (primary) |
| 6 | `no-transactions` | `receipt` | No transactions yet | Online and cash payments will be recorded here. | *(none)* |
| 7 | `no-organization` | `credit-card` | You don't belong to any organization yet | Wait for an invitation or set up your own solo business. | **Set up solo work** (primary) |
| 8 | `no-roles` | `key-round` | No custom roles yet | Duplicate a built-in role or create one from scratch. | **Create role** (outline) |

> **Note**: Variant #7 (`no-organization`) has a wider title area — the design shows `width: 260px` for the title text instead of the default. Make the title container flexible to accommodate longer text.

---

## 7. Grid Layout for Multiple Cards

When displaying multiple empty state cards (e.g., on a gallery page), arrange them in a grid:

```css
.empty-states-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  width: 100%;
}

@media (max-width: 1200px) {
  .empty-states-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .empty-states-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 8. Usage in Pages

### Example: Orders page with no data

```vue
<script setup lang="ts">
import { CalendarDays } from 'lucide-vue-next';
import EmptyStateCard from '@/components/app/EmptyStateCard.vue';

function handleAddWalkIn() {
  // Navigate to walk-in form
}
</script>

<template>
  <div class="orders-page">
    <!-- When orders list is empty: -->
    <EmptyStateCard
      :icon="CalendarDays"
      title="No bookings yet"
      description="Customers will appear here as soon as they request service."
      button-label="Add walk-in"
      button-variant="primary"
      @button-click="handleAddWalkIn"
    />
  </div>
</template>
```

### Example: Using the predefined config

```vue
<script setup lang="ts">
import { getEmptyState } from '@/data/emptyStates';
import EmptyStateCard from '@/components/app/EmptyStateCard.vue';

const noBookings = getEmptyState('no-bookings')!;
</script>

<template>
  <EmptyStateCard
    :icon="noBookings.icon"
    :title="noBookings.title"
    :description="noBookings.description"
    :button-label="noBookings.buttonLabel"
    :button-variant="noBookings.buttonVariant"
    @button-click="handleAddWalkIn"
  />
</template>
```

---

## 9. States & Edge Cases

| Scenario | Behavior |
|----------|----------|
| No button variant | Button not rendered (v-if="buttonLabel") |
| Very long description | Text wraps naturally within 260px max-width |
| Very long title | Text wraps; consider truncating at 2 lines |
| Missing icon | Shows empty circle — always provide an icon |
| Click without handler | Button emits but nothing happens — acceptable for display-only |
| RTL languages | Text alignment stays centered — works fine |

---

## 10. Accessibility Notes

- Icon is decorative: `aria-hidden="true"` on the icon circle
- Title is an `<h3>` for proper heading hierarchy
- Action button is a `<button>` with a descriptive label
- Card itself could have `role="status"` for screen readers to announce changes (e.g., loading → empty)
- If the card replaces a loading state, use `aria-live="polite"` on the container

---

## 11. Design Tokens Reference

| Token | Value | Usage |
|-------|-------|-------|
| Card background | `#FFFFFF` | `.empty-state-card` |
| Card border | `1px solid #C5C5CB` | `.empty-state-card` |
| Card radius | `24px` | `.empty-state-card` |
| Card height | `240px` | `.empty-state-card` |
| Card padding | `24px` | `.empty-state-card` |
| Icon circle size | `52×52px` | `.empty-state-card__icon-circle` |
| Icon circle bg | `#F5F5F5` | `.empty-state-card__icon-circle` |
| Icon size | `24px` | `<component :size="24">` |
| Icon color | `#616167` | `color="#616167"` |
| Title font | Inter 14px 600 `#2A2933` | `.empty-state-card__title` |
| Desc font | Inter 12px normal `#616167` | `.empty-state-card__description` |
| Button primary bg | `#5749F4` | `.empty-state-card__button--primary` |
| Button outline bg | `#FFFFFF` | `.empty-state-card__button--outline` |
| Button outline border | `1px solid #C5C5CB` | `.empty-state-card__button--outline` |
| Button radius | `999px` | both button variants |
| Button padding | `6px 14px` | both button variants |
| Button font | Inter 12px 600 | both button variants |
| Button primary text | `#FFFFFF` | `.empty-state-card__button--primary` |
| Button outline text | `#2A2933` | `.empty-state-card__button--outline` |
| Gap between elements | `10px` | `.empty-state-card` |
