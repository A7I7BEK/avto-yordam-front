# Page Prompt: Invite Team Member

> **Design Node ID**: `aEPiR` | **Name**: "28 - Invite Team Member"
> **Route**: `/business/team/members/invite` | **View File**: `src/views/business/MemberInvite.vue`

## Overview
Form or modal for inviting a new team member. Breadcrumb: Team > Members > Invite. Can be a full page or a modal over the roster.

## Header
- Title: "Invite team member" with subtitle "Send an invitation to join your organization"
- Breadcrumb: Team > Members > Invite

## Form
- **Phone number** — required, UZ format (+998), placeholder "90 123 4567"
- **Full name** — text input
- **Role** — select: Master, Receptionist, Admin
- **Message** (optional) — textarea, "Add a personal message to the invitation..."
- Info box: "An SMS with a registration link will be sent to this number."

## Buttons
- Cancel (outline) → back to roster
- Send invitation (primary `#5749F4`)

## Mock
On success: show toast "Invitation sent to +998 90 123 4567". Member appears in roster with "Pending" status.
