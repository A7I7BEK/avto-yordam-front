# Component Prompt: Delete Confirmation Dialog

> **Design Node ID**: `gRz6e`
> **Page Name**: Delete Confirmation — "53 — Delete Confirmation"
> **Component File**: `src/components/notifications/DeleteConfirmDialog.vue`
> **Usage**: Opens from the Notifications Center when the trash icon on a notification card is clicked

---

## 1. Overview

A simple confirmation dialog that asks the user to confirm deletion of a notification. It appears centered over the dimmed notifications page. The dialog shows a warning icon, confirmation message, and Cancel/Delete buttons.

---

## 2. Dialog Structure

```
┌──────────────────────────────┐
│                              │
│         ┌──────────┐         │
│         │  🗑 48px  │         │ ← Warning icon circle (red bg)
│         └──────────┘         │
│                              │
│    Delete notification?      │ ← Title
│    This action cannot be     │ ← Description
│    undone.                   │
│                              │
│  ┌──────────┐ ┌──────────┐  │
│  │  Cancel  │ │  Delete  │  │ ← Buttons
│  └──────────┘ └──────────┘  │
│                              │
└──────────────────────────────┘
```

---

## 3. Overlay

```css
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200; /* above notification detail modal if needed */
}
```

---

## 4. Dialog Container

```css
.delete-confirm-dialog {
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 24px;
  border-radius: 24px;
  background: #FFFFFF;
  border: 1px solid #C5C5CB;
  box-shadow: 0 20px 50px rgba(0,0,0,0.24);
  text-align: center;
}
```

---

## 5. Content

### 5.1 Icon Circle

48×48px, radius 999, `#FDEBEC` bg (light red). `trash-2` icon 24px, `#CC3314`.

### 5.2 Title

"Delete notification?" — Inter 18px 700, `#2A2933`

### 5.3 Description

"This action cannot be undone." — Inter 14px normal, `#616167`

---

## 6. Buttons

Horizontal pair, gap 8px, full width.

### Cancel Button

```css
.btn-cancel {
  flex: 1;
  padding: 12px;
  border-radius: 999px;
  border: 1px solid #C5C5CB;
  background: #FFFFFF;
  color: #2A2933;
  font: Inter 14px 600;
}
```

### Delete Button

```css
.btn-delete {
  flex: 1;
  padding: 12px;
  border-radius: 999px;
  border: none;
  background: #CC3314;
  color: #FFFFFF;
  font: Inter 14px 600;
}
```

---

## 7. Component Interface

```typescript
defineProps<{
  notificationTitle: string; // e.g. "New booking #BK-1247"
}>();

defineEmits<{
  confirm: [];  // Delete confirmed
  cancel: [];   // Cancelled
}>();
```

---

## 8. Behavior

- **Cancel** → emit `cancel`, close dialog
- **Delete** → emit `confirm`, close dialog, parent removes notification from list
- Close on Escape, close on overlay click

---

## 9. Accessibility

- `role="alertdialog"`, `aria-modal="true"`
- `aria-labelledby` for the title
- Focus trap: focus cycles between Cancel and Delete
- Escape triggers Cancel


**Screenshot**: `03-delete-confirmation.png`
