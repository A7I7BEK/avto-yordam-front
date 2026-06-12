# Page Prompt: Network Offline

> **Design Node ID**: `K2lGoP` | **Name**: "55 - Network Offline"
> **Route**: shown when network is lost (global interceptor) | **View File**: `src/views/utility/Offline.vue`

## Overview
Full-page offline screen shown when the internet connection is lost. Centered layout with icon, title, description, and retry button. Does NOT use AppShell. Can also be shown as an overlay banner over existing pages.

## Layout
- Full viewport, centered vertically and horizontally
- Max content width: 520px
- Padding: 48px

## Content
- **Icon**: 96×96px circle, `#F5F5F5` bg, `wifi-off` icon 48px, `#616167`
- **Title**: "Offline" — Inter 64px 700, `#2A2933`, letter-spacing -2px (or smaller for non-English)
- **Subtitle**: "You're not connected to the internet" — Inter 22px 700, `#2A2933`
- **Description**: "Check your Wi-Fi or mobile data connection. We'll automatically reconnect once you're back online." — Inter 14px normal, `#616167`, centered, max-width 440px
- **Primary button**: "Try again" — pill, `#5749F4`, triggers `window.location.reload()`
- **Secondary button**: "Go to dashboard" — outline

## Help Link
Bottom hint: "Still having issues? Contact support" — Inter 12px, link

## Behavior
- This page can be triggered by a global network status listener
- When connection is restored, automatically navigate back or show a "Reconnected!" toast
- Can also show as a smaller banner: "⚠️ You're offline. Some features may be unavailable." at the top of pages
