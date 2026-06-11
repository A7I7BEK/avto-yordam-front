# Page Prompt: Professional Settings — Privacy & Data

> **Design Node ID**: `x8ynww` | **Route**: `/professional/settings/privacy`
> **Shared Shell**: Sidebar (Settings active) + Header + Settings sub-nav

---

## 1. Overview

Privacy preferences with toggle switches, a data export request button, and a dangerous "Delete account" action card.

---

## 2. Content Structure

```
┌──────────────────────────────────────────────────────────┐
│ Workspace > Settings > Privacy & data                    │
│                                                          │
│ ┌──────────┬─────────────────────────────────────────────┤
│ │PERSONAL  │  Privacy & data                             │
│ │          │                                             │
│ │👤Account │  ┌─────────────────────────────────────────┐│
│ │          │  │ Show me in Drivers app search    [ON]   ││
│ │🔔Notif.  │  │ Drivers can find you...                 ││
│ │          │  ├─────────────────────────────────────────┤│
│ │PREFERENCES│ │ Share rating publicly           [ON]   ││
│ │          │  │ Display your average rating...          ││
│ │🎨Appear. │  ├─────────────────────────────────────────┤│
│ │          │  │ Allow Masters to use my data   [OFF]   ││
│ │🛡Privacy │  │ Aggregated usage signals only...        ││
│ │ (active) │  ├─────────────────────────────────────────┤│
│ │          │  │ Share contact with customers   [ON]    ││
│ │          │  │ After order confirmed...                ││
│ │          │  └─────────────────────────────────────────┘│
│ │          │                                             │
│ │          │  ┌─────────────────────────────────────────┐│
│ │          │  │ Download my data        [Request export]││
│ │          │  │ Export every order, review...           ││
│ │          │  └─────────────────────────────────────────┘│
│ │          │                                             │
│ │          │  ┌─────────────────────────────────────────┐│
│ │          │  │ ⚠ Delete account      [Delete account] ││
│ │          │  │ Permanently delete your profile...      ││
│ │          │  └─────────────────────────────────────────┘│
│ └──────────┴─────────────────────────────────────────────┤
└──────────────────────────────────────────────────────────┘
```

---

## 3. Shell (shared)

- Breadcrumb: `Workspace > Settings > Privacy & data`
- Sub-nav: Privacy & data **active** (`#F5F5F5` bg, 600 weight)

---

## 4. Page Header

- **Title**: "Privacy & data", Inter 22px 700, `#2A2933`

---

## 5. Privacy Toggles Card

Card: rounded 24px, `#FFFFFF` bg, 1px `#C5C5CB` border, clipped overflow.

4 toggle rows, each: padding 16px 20px, `space-between`, `align-items:center`, border-bottom 1px `#C5C5CB` (except last row).

### Toggle Row Structure

**Left** (flex column, gap 2px, `flex:1`):
- Label: Inter 14px 500, `#2A2933`
- Description: Inter 12px, `#616167`

**Right**: Toggle switch (Switch component pattern).

### Switch Styling

| State | Track | Knob |
|-------|-------|------|
| ON (checked) | 40px wide, `#5749F4` bg, rounded pill, padding 4px | 16px circle, `#FFFFFF` bg, positioned right (`justify-content:end`) |
| OFF (unchecked) | 40px wide, `#C5C5CB` bg, rounded pill | Same, positioned left (`justify-content:start`) |

### The 4 Toggles

| # | Label | Description | Default |
|---|-------|-------------|---------|
| 1 | Show me in Drivers app search | Drivers can find you as an individual master in the customer app. | **ON** |
| 2 | Share rating publicly | Display your average rating on your public profile. | **ON** |
| 3 | Allow Masters to use my data for product analytics | Aggregated usage signals only. Never shared with third parties. | **OFF** |
| 4 | Share my contact info with confirmed customers | After an order is confirmed, customers can call your direct phone. | **ON** |

---

## 6. Download My Data Card

Card: rounded 24px, `#FFFFFF` bg, 1px `#C5C5CB` border, padding 18px, `space-between`, `align-items:center`, gap 12px.

**Left**: "Download my data" (Inter 14px 600) + "Export every order, review, invitation and message ever recorded under your account. Ready in 24h." (Inter 12px `#616167`), gap 2px

**Right button**: Outline pill, padding 8px 14px, `#FFFFFF` bg, 1px `#C5C5CB` border. `download` icon 12px + "Request export" Inter 12px 600 `#2A2933`, gap 6px.

Click → mock toast "Export requested. You'll receive an email within 24 hours."

---

## 7. Delete Account Card

Card: rounded 24px, `#FFFFFF` bg, 1px `#C5C5CB` border, padding 18px, `space-between`, `align-items:center`, gap 12px.

**Left** (gap 2px):
- Header row (gap 8px): `triangle-alert` icon 14px `#CC3314` + "Delete account" Inter 14px 600 `#CC3314`
- Description: "Permanently delete your Employee profile. Organizations you own must be deactivated or transferred first." Inter 12px `#616167`

**Right button**: Outline pill, padding 8px 14px, 1px `#CC3314` border. "Delete account" Inter 12px 600 `#CC3314`.

Click → show confirmation dialog/modal before proceeding.

---

## 8. Mock Data

```typescript
const privacyToggles = [
  { id: 'search', label: 'Show me in Drivers app search', desc: 'Drivers can find you as an individual master in the customer app.', value: true },
  { id: 'rating', label: 'Share rating publicly', desc: 'Display your average rating on your public profile.', value: true },
  { id: 'analytics', label: 'Allow Masters to use my data for product analytics', desc: 'Aggregated usage signals only. Never shared with third parties.', value: false },
  { id: 'contact', label: 'Share my contact info with confirmed customers', desc: 'After an order is confirmed, customers can call your direct phone.', value: true },
];
```

---

## 9. Vue Component

### File: `src/views/professional/settings/Privacy.vue`

### Icons (Lucide)
`Shield`, `Download`, `TriangleAlert`, `ChevronRight`

---

## 10. Implementation Checklist

1. [ ] Create `src/views/professional/settings/Privacy.vue`
2. [ ] Reuse shell + sub-nav (Privacy & data active)
3. [ ] Privacy toggles card with 4 rows and toggle switches
4. [ ] Download data card with "Request export" button
5. [ ] Delete account card with red styling and confirmation dialog
6. [ ] All toggles reactive (v-model)
7. [ ] Run `pnpm dlx ultracite fix`

**Screenshot**: `01-privacy-data.jpg`
