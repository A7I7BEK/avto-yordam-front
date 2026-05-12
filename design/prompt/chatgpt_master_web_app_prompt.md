# Master / Organization Web App — AI Design Prompt

Design a modern, clean, desktop-first responsive **web app** for auto service providers.

This app should support two related roles:
- **Master** — an individual specialist
- **Organization** — a service center or business

## Product goal
Create a provider-facing platform where masters and organizations can:
- register and manage profiles,
- receive and manage reservations,
- organize team members,
- track ratings and completed orders,
- present services clearly to drivers,
- prepare the system for future online payments.

## Style direction
- Modern and clean UI inspired by **shadcn/ui** and **Tailwind CSS**
- Light theme as default
- Dark theme available
- Rounded cards, subtle shadows, strong typography, organized spacing
- Professional, trustworthy, and operational
- Web app only, responsive for tablet and mobile browsers, but designed primarily for desktop

## Language and auth requirements
- Show a language selector in the UI for future support of:
  - English
  - Uzbek
  - Russian
- For now, all visible copy should be in **English**
- Authentication must support both:
  - Phone number + SMS OTP
  - Email + password
- Create a visually strong **auth selection page** where the user chooses between the two sign-in methods

## Core references for UX
- Use the trust, status, and performance patterns similar to **Yandex Go**
- Show ratings, completed orders, and availability clearly
- Make the provider experience feel organized and operational, not cluttered

## Organization model
There are 3 organization types:
- **MCHJ**
- **YTT**
- **O‘zini-o‘zi band qilgan shaxs** (self-employed)

### Important rules
- A master should be linked to an organization
- If a master wants to work in an organization, they must receive an invitation from that organization
- A solo master must first create a **self-employed organization**
- Then the master can invite themselves into that organization
- The UI should make this relationship easy to understand

## Main pages and sections

### 1) Landing / Entry
- Clear role selection:
  - Master
  - Organization
- Concise explanation of what each role can do
- Strong CTA to continue registration

### 2) Authentication
- Welcome page
- Choice between phone OTP and email/password
- Sign up / sign in screens
- Clean, modern, trustworthy design

### 3) Onboarding
- Separate onboarding flows for:
  - Master
  - Organization
- For organizations, include type selection:
  - MCHJ
  - YTT
  - Self-employed

### 4) Dashboard
- Today’s reservations
- Upcoming reservations
- Completed reservations
- Earnings or revenue summary
- Rating
- Completed order count
- Performance overview

### 5) Reservation Management
Design for the current state:
- reservation only

Also make the layout ready for the future:
- reservation + online payment

Include:
- reservation list
- calendar view
- status labels:
  - new
  - confirmed
  - in progress
  - completed
  - cancelled
- reservation detail drawer or panel

### 6) Service Management
- Add/edit services
- Set duration
- Set price
- Set category
- Set availability schedule
- Optional photos and descriptions

### 7) Master Profile
- Rating
- Completed orders
- Skills
- Service categories
- Reviews
- Availability
- Verified status

### 8) Organization Profile
- Organization name
- Organization type
- Branch/location info
- Team members
- Invited masters
- Ratings and completed jobs
- Organization settings

### 9) Invitations & Team Management
- Invite masters to an organization
- Accept / reject invitations
- Display membership status clearly
- Show solo/self-employed structure clearly
- Role and access management

### 10) Notifications
- New reservation alerts
- Invitation alerts
- Reservation updates
- Review alerts
- Future payment-related alerts

## Key UI components to include
- Top navigation with language selector and auth state
- Role switcher between Master and Organization
- Invite management cards
- Reservation cards and calendar
- KPI summary cards
- Team list and status chips
- Service editor forms
- Empty states and loading states

## Important design constraints
- Keep the interface highly readable and operational
- Make ratings and completed orders prominent, because they are core trust signals
- Make invitation-based membership easy to understand visually
- Keep future online payment support visible, but secondary to reservation
- Use a modern SaaS dashboard feel with an understated, professional tone

## Output expectation
Generate a high-fidelity, modern web app design for the provider side with a clear information architecture and polished component-level UI.
