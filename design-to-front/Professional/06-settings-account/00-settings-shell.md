# Professional Settings > Account — Master Document

> **Routes**: `/professional/settings/account` with tab query params
> **Shared Shell**: Sidebar (Settings active) + Header + Settings sub-nav + Account tabs

---

## Shared Shell Structure

```
┌──────────────────────────────────────────────────────────┐
│ Sidebar │ Header                                         │
│ Settings│                                                │
│ active  ├────────────────────────────────────────────────┤
│         │ Workspace > Settings                           │
│         │                                                │
│         │ ┌──────────────────────────────────────────────┤
│         │ │  Settings                                    │
│         │ │  Manage your account and preferences         │
│         │ └──────────────────────────────────────────────┤
│         │                                                │
│         │ ┌──────────┬──────────────┬──────────────────┐ │
│         │ │ 👤Account│ 🔔Notif...   │ 🎨Appearance     │ │  ← sub-nav
│         │ │ (active) │              │   & language     │ │
│         │ │          │ 🛡Privacy... │                  │ │
│         │ └──────────┴──────────────┴──────────────────┘ │
│         │                                                │
│         │ ┌──────────┬──────────────┬──────────────────┐ │
│         │ │Personal  │ Phone &      │ Languages        │ │  ← tabs
│         │ │info      │ email        │                  │ │
│         │ │(active)  │              │                  │ │
│         │ └──────────┴──────────────┴──────────────────┘ │
│         │                                                │
│         │   [Page-specific content varies here]          │
└──────────────────────────────────────────────────────────┘
```

---

## 4 Pages (Nodes)

| # | Node | Tab Active | Mode | Description |
|---|------|-----------|------|-------------|
| 01 | `G9Fnan` | Personal info | Preview (read-only) | View profile + "Edit profile" button |
| 02 | `yuhUc` | Languages | Edit | Manage language chips |
| 03 | `B9txSQ` | Phone & email | Edit | Change phone, add/verify email |
| 04 | `nHi2O` | Personal info | Edit | Edit form fields |

---

## Sub-Navigation (left side, 256px wide)

4 items, each: padding 8px 12px, rounded 6px, gap 10px, icon 16px + text 13px 500.

| # | Icon | Label | Default |
|---|------|-------|---------|
| 1 | `user` | Account | **Active** (`#2A2933` text) |
| 2 | `bell` | Notifications | Inactive (`#2A2933` — all items use same color) |
| 3 | `palette` | Appearance & language | Inactive |
| 4 | `shield` | Privacy & data | Inactive |

---

## Horizontal Tabs (below page title)

3 tabs with bottom border indicator:

| Tab | Active Style | Inactive Style |
|-----|-------------|----------------|
| Personal info | Purple text `#5749F4` 600 + 2px purple bottom border | `#616167` 500 |
| Phone & email | Same | `#616167` 500 |
| Languages | Same | `#616167` 500 |

Each tab: padding 10px 16px.

---

## Breadcrumb

`Workspace > Settings` (Inter 13px, chevron-right, "Settings" 500 `#2A2933`)

## Page Title

"Settings" Inter 24px 700 + "Manage your account and preferences" Inter 13px `#616167`
