# Page Prompt: Photos

> **Design Node ID**: `EJhUX` | **Name**: "49 - Photos"
> **Route**: `/business/settings/photos` | **View File**: `src/views/business/SettingsPhotos.vue`

## Overview
Settings page to manage business photos displayed to customers. Includes workspace photos, exterior, and logo. Drag-to-reorder grid with upload and delete. Part of Settings section. Breadcrumb: Settings > Photos.

## Header
- Title: "Photos" (Inter 24px 700)
- Subtitle: "Show your workspace to attract more customers"
- Save button (primary, top-right)

## Sections

### Logo
- Large circular upload area (120×120px, dashed border)
- Current logo preview with edit overlay
- "Upload logo" button
- Recommended: PNG/JPG, min 500×500px

### Cover Photo
- Wide upload area (full width, 200px height, dashed border)
- Current cover preview
- "Upload cover" button
- Recommended: 1200×400px

### Gallery (workspace photos)
- Grid of photo cards (3-4 columns)
- Each card: image preview with overlay actions (delete X, drag handle)
- **Upload card** (first in grid): dashed border with "+" icon and "Add photo" text
- Max 10 photos
- Drag to reorder (drag handle icon on each card)

### Photo Card States
- **Uploaded**: image preview, delete button (top-right)
- **Uploading**: progress bar overlay
- **Empty**: dashed border with + icon

## Mock Data
```typescript
export const photos = {
  logo: { url: '/mock/logo.png', uploaded: true },
  cover: { url: '/mock/cover.jpg', uploaded: true },
  gallery: [
    { id: 'p1', url: '/mock/workshop1.jpg', order: 1 },
    { id: 'p2', url: '/mock/workshop2.jpg', order: 2 },
    { id: 'p3', url: '/mock/reception.jpg', order: 3 },
    { id: 'p4', url: '/mock/waiting.jpg', order: 4 },
  ],
};
```

## Bottom Actions
- Cancel → discard changes
- Save changes (primary `#5749F4`)

**Screenshot**: `01-photos.png`
