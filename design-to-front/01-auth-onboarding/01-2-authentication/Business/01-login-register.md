# Page Prompt: org01 — Business Login/Register

> **Design Node ID**: `c274v` | **Route**: `/auth/business` | **Viewport**: 1440×900px

## 1. Overview

Entry point for Business authentication. Same structure as Professional Login/Register with Business-specific branding and copy.

## 2. Brand Header

| Element | Business Spec |
|---------|--------------|
| Logo icon | **`building-2`** (Lucide), 20px, `#FFFFFF` |
| Logo bg | `#2A2933` (--foreground) ← **dark, not purple** |
| Logo size | 36×36px, border-radius: 10px |
| Text | "Business", Inter 24px, weight 600, `#2A2933` |

## 3. Card Content (460px, padding 40px, gap 22px)

### Back Link → `/auth/account-type`

### Header
- **Title**: "Welcome to Business"
- **Subtitle**: "Manage your team, schedule, and bookings"

Both Inter, `#2A2933` / `#616167` (same styling as Professional).

### Buttons
| Button | Text | Icon | Style |
|--------|------|------|-------|
| Phone | "Continue with phone" | `phone` (Lucide) | Primary (`#5749F4`) → `/auth/business/phone` |
| Email | "Continue with email" | `mail` (Lucide) | Secondary (`#D9D9DB`) → `/auth/business/signin?tab=signin` |

### "or" Divider — same pattern

### Social Buttons — same pattern (Google, Apple — stubs)

### Footer Link
- "Are you a master?" + "Switch to Master"
- **Navigation**: → `/auth/professional` (Professional flow)

## 4. Implementation

Create `src/views/auth/business/LoginRegister.vue`. Same structure as Professional equivalent but with:
- `building-2` icon + `#2A2933` logo bg
- Business-specific headings
- Navigation to business routes
- "Switch to Master" navigation

**Screenshot**: `01-login-register.png`
