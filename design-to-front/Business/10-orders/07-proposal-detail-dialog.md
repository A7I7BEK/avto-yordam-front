# Component Prompt: Proposal Detail Dialog

> **Design Node ID**: `ZQbUK` | **Name**: "23 — Proposal Detail Dialog"
> **Component File**: `src/components/orders/ProposalDetailDialog.vue`

## Overview
Dialog showing a detailed service proposal/quotation for an order. Includes parts, labor, and total breakdown. Opens from Order Detail or when reviewing a pending order.

## Dialog (600px)
- Header: "Proposal — #BK-1247"
- Close button (X)

## Content
- **Service**: Brake pads exchange — description
- **Parts breakdown** (table):
  | Part | Qty | Unit Price | Total |
  |------|-----|-----------|-------|
  | Front brake pads (OEM) | 1 | 350 000 | 350 000 |
  | Rear brake pads (OEM) | 1 | 280 000 | 280 000 |
  | Brake fluid | 0.5L | 40 000 | 20 000 |
- **Labor**: "90 min × 200 000 UZS/hr = 200 000 UZS"
- **Total**: "850 000 UZS" (Inter 20px 700)
- **Notes**: "Inspect rotors for scoring. Road test after fitment."

## Buttons
- Close (outline)
- Send to customer (primary) — sends proposal via SMS
