# AI Agent Prompt — Masters Web App Design

## Your role
You are a senior product designer + frontend engineer. Produce a complete, screen-by-screen design specification for a responsive web application, delivered as **HTML + React (functional components) + TailwindCSS + shadcn/ui** code so the screens can be rendered as visual mockups. For each screen, include a short narrative (purpose, key actions, edge states) followed by the component code. Do not stub screens — every screen listed must be fully designed.

## Product overview
A web-based application for **service providers** in the auto repair industry: individual masters (mechanics, technicians, body shop specialists, etc.) and service center organizations. The platform connects them with car owners (drivers) who use a separate Drivers app to discover services and book appointments.

This is the **Masters** side. Out of scope for this prompt: the Drivers app, the OBD2-reading mobile app.

## Two account kinds
On this platform there are two distinct account kinds, established at onboarding:

### 1. Master (individual professional)
A person who performs auto services. A master has a personal profile that travels with them across organizations: rating, completed orders, reviews, specialties, certifications, portfolio. A master can be:
- **Unaffiliated (solo)** — works independently, takes bookings directly. Has a tax status field on their profile: `YTT` or `Self-employed` (`O‘zini-o‘zi band qilgan shaxs`). Takes bookings under their own name.
- **Affiliated** — accepted an invitation from one or more organizations. Bookings can come either through an organization (as a member of its team) or directly to them.
- A master can be both at once: solo bookings AND a member of one or several organizations.

### 2. Organization (service center)
A registered legal entity that hires/affiliates masters and accepts bookings under its brand. Three legal types — these must be selectable during org registration with clear explanations:
- **MCHJ** — Mas'uliyati cheklangan jamiyat (Limited Liability Company).
- **YTT** — Yakka tartibdagi tadbirkorlik (Sole proprietorship).
- **Self-employed** — O‘zini-o‘zi band qilgan shaxs.

An organization has one or more **admin users** (the people who registered it / were granted admin rights). Admins manage the org; they may or may not also be masters themselves.

### Invitation model (important)
- An organization invites an existing master by phone or email.
- The master receives the invitation in their **Invitations inbox** and chooses Accept or Decline.
- On accept, the master becomes affiliated. The master keeps their personal rating and completed-orders count; the org gains a team member.
- The master can leave an org at any time. The org can remove a master at any time.
- A master who wants to work solo does **not** invite themselves anywhere. They simply mark themselves as solo and set their tax status. There is no fake-organization workaround.

## Target users
Auto service professionals in Uzbekistan — workshops, body shops, individual mechanics, mobile masters. Mid-tech-literacy. Mostly desktop usage during work, but the app must be responsive for mobile because masters often check bookings on their phones. Languages: UZ primary, RU, EN. UI must include a language selector (EN / UZ / RU) but for this design pass, **all copy is in English**.

## Design language & system
- Modern, clean, professional. Slightly more "tool-like" / dashboard-dense than the Drivers app, but still using the same visual DNA so the two products feel like a family.
- Tailwind utility classes + shadcn/ui components. Use `Card`, `Table`, `DataTable`, `Tabs`, `Sheet`, `Dialog`, `Form`, `Calendar`, `Command`, `DropdownMenu`, `Badge`, `Avatar`, `Toast`, `Popover`.
- **Light theme is default. Dark theme must be supported** via Tailwind's `dark:` modifier and a theme toggle in the user menu.
- Typography: Inter or similar geometric sans. Tabular numerals for stats and money.
- Color: same restrained accent as Drivers app (propose one — deep electric blue or graphite + amber). Status colors for booking states (pending/confirmed/in-progress/completed/cancelled/no-show).
- Rounded corners (`rounded-xl`), soft shadows, clear borders. No heavy gradients.
- Iconography: lucide-react.
- Maps: **Yandex Maps** (mock the embed area as a styled placeholder when needed).

## Localization & theming requirements
- Global app shell on every authenticated screen: logo, primary navigation (sidebar on desktop, drawer + bottom nav on mobile), org switcher (if user is an admin of multiple orgs or both a master and an org admin), language selector, theme toggle, notifications bell, user avatar dropdown (Profile, Settings, Switch role, Log out).
- Strings must be wrap-friendly for ~30% longer translated text.

## Information architecture — screens to design
Design every screen below. Use realistic dummy data: Tashkent addresses, UZS prices, Uzbek-style names, plausible service catalog (Body repair, Engine diagnostics, A/C service, Oil change, Tire fitting, Detailing, Electrical, Welding, etc.).

### A. Authentication & onboarding
1. **Auth method selector** — visually striking page; two large cards: "Continue with phone" and "Continue with email". Premium feel.
2. **Phone — enter number** (country code dropdown defaulting to +998).
3. **Phone — enter OTP** (6-digit input, resend timer).
4. **Email — sign in** (email + password, forgot password, switch to phone).
5. **Email — sign up** (email, password, confirm, T&C).
6. **Forgot password** flow.
7. **Account kind picker** (right after first signup) — two large cards: "I'm a Master" (subline: I perform auto services personally) and "I represent an Organization" (subline: I run or manage a service center). User can later add the other role from settings.
8. **Master onboarding** — multi-step:
   - Step 1: Personal info (full name, photo, date of birth, phone, email).
   - Step 2: Work status (Solo / Will join an organization later) and tax status if solo (`YTT` / `Self-employed`) with field for tax ID.
   - Step 3: Specialties (multi-select chips: Engine, Transmission, Bodywork, Paint, Electrical, Diagnostics, Tires, A/C, etc.) and years of experience.
   - Step 4: Services & pricing (add services from a catalog with price + duration).
   - Step 5: Working hours (weekly schedule editor) and service area (Yandex map area selector or city/district picker).
   - Step 6: Portfolio (photo upload).
   - Step 7: Review & submit.
9. **Organization onboarding** — multi-step:
   - Step 1: Org type selector (`MCHJ` / `YTT` / `Self-employed`) with explanation cards for each.
   - Step 2: Legal info (legal name, brand/display name, tax ID / INN, registration documents upload, bank details placeholder).
   - Step 3: Address & coverage (Yandex map pin + address form, optional service-area polygon or radius).
   - Step 4: Contact (phone, email, website, social).
   - Step 5: Services & pricing.
   - Step 6: Operating hours.
   - Step 7: Photos (storefront, garage, equipment).
   - Step 8: Invite first masters (skip-able).
   - Step 9: Review & submit.

### B. Dashboards (role-aware)
10. **Master dashboard** — KPI strip (today's bookings, week's bookings, current rating, completed orders, earnings this month), today's schedule, pending bookings to confirm, pending invitations from orgs, recent reviews, quick actions (Block time, Edit services, Update availability).
11. **Organization admin dashboard** — KPI strip (today's bookings org-wide, this week's revenue, active masters, occupancy %, average rating, no-show rate), today's schedule across all masters (timeline / Gantt-like view), bookings needing attention, masters availability summary, recent reviews, quick actions.

### C. Bookings (the core tool)
12. **Bookings — list view** — data table with filters (status, date range, master, service, customer name/phone). Columns: ID, customer, car, service, master assigned, date/time, price, status, actions. Bulk actions for org admins.
13. **Bookings — calendar view** — week/day/month toggle. For org admins: resource timeline (one row per master). For solo masters: single calendar.
14. **Booking detail** — left column: customer info (name, phone, photo, rating as a customer), car info (make/model/year/plate/mileage, link to OBD2 highlights and active DTCs if customer shared them), service requested, attached photos/notes from customer; right column: status timeline, assignment (master, bay/lift if applicable), pricing breakdown editable by provider, internal notes, action buttons (Confirm, Decline, Reassign, Reschedule, Mark in-progress, Mark completed, Mark no-show, Issue invoice, Refund — last one tagged "future"). Chat panel.
15. **New booking (manual entry)** — for walk-ins/phone bookings: customer search-or-create, car search-or-create, service, master, date/time, price.
16. **Reschedule dialog** and **Decline dialog** (with reason).
17. **Chat with customer** — bubble UI, attachments, quick replies, status (read/sent), customer profile sidebar.

### D. Schedule
18. **My schedule (master)** — weekly working hours editor, time-off / vacations, blocked slots, per-day capacity.
19. **Org schedule (admin)** — set org operating hours, holidays, and per-master overrides.

### E. Team & invitations
20. **Masters roster (org admin)** — table of affiliated masters: avatar, name, specialties, rating, completed orders, status (active/inactive), join date, actions (View profile, Edit role, Suspend, Remove). Search and filter.
21. **Invite a master (org admin)** — modal: enter phone or email, optional welcome message, role (Master / Co-admin), services subset they can perform. Sends an invitation.
22. **Sent invitations (org admin)** — list of pending/accepted/declined invitations with resend/cancel actions.
23. **My invitations inbox (master)** — incoming invitations with org name, brand, address, type badge, services, message, Accept / Decline buttons. Accepted-then-current memberships shown below.
24. **My memberships (master)** — list of orgs the master is affiliated with: org name, type, role, since date, status, "Leave organization" action.

### F. Catalog & pricing
25. **Services catalog** — manage which services this master/org offers. Table with service name, category, price, duration, description, status. Add/edit dialog. Bulk import.
26. **Pricing rules** (optional advanced) — surcharges (off-hours, urgent), discounts (loyalty, first-time), package deals.

### G. Profile & public presence
27. **Master public profile editor** — preview pane on the right showing exactly how the profile looks to drivers in the Drivers app. Edit photo, bio, specialties, certifications, portfolio.
28. **Organization public profile editor** — same pattern: photos, brand description, address, hours, services preview, masters list preview.

### H. Reviews & reputation
29. **Reviews received** — list with rating distribution chart, filter by rating, reply to review, flag inappropriate.
30. **Reputation overview** — rating trend over time, completed orders count, response rate, on-time rate, no-show rate.

### I. Earnings & payments (designed; mark online-pay parts as future)
31. **Earnings overview** — chart by week/month, breakdown by service type, by master (for orgs), top customers.
32. **Transactions** — table of completed bookings with paid/unpaid status. "Pay at service" entries marked as cash-collected. Online payment entries clearly tagged "Coming soon" in this design pass.
33. **Payouts** — bank account setup, payout schedule, payout history. Tag the screen as "Future feature" with a subtle ribbon.

### J. Settings
34. **Account settings** — personal info, phone, email, password, two-factor.
35. **Organization settings (admin)** — legal info, branding, address, operating hours, notification preferences, danger zone (deactivate org).
36. **Roles & permissions (admin)** — define co-admin permissions.
37. **Notifications preferences** — toggles for booking events, invitations, reviews, payouts.
38. **Appearance & language** — Theme (Light/Dark/System), Language (EN/UZ/RU).
39. **Privacy & data**.

### K. Notifications & misc
40. **Notifications center** — full-page list, grouped by date, type icons.
41. **Empty states** — for: no bookings, no masters, no invitations, no reviews, no transactions, no services in catalog.
42. **404 / error page**.
43. **Org switcher** — dropdown/popover when a user manages multiple orgs or is both a master and org admin: lists all roles, current selected, "Add organization", "Become a master".

## Reusable components to define explicitly
Define and show these as a reusable component library section before generating screens: `AppShell`, `Sidebar` (collapsible), `MobileBottomNav`, `TopBar`, `OrgRoleSwitcher`, `KpiCard`, `BookingCard`, `BookingStatusBadge`, `OrgTypeBadge` (`MCHJ` / `YTT` / `Self-employed`), `MasterCard`, `MasterRoster` row, `InvitationCard`, `RatingDisplay`, `ServiceRow`, `WorkingHoursEditor`, `Stepper`, `OTPInput`, `EmptyState`, `MapEmbedPlaceholder`, `ResourceTimeline` (calendar Gantt for multi-master view), `MoneyCell` (UZS-formatted, tabular figures).

## Reference apps (study and adapt)
- **Yandex Go (driver/partner app)** — for the partner-facing pattern of displaying rating, completed orders, status badges, and the calm trustworthy visual tone.
- **arzonapteka.uz / osonapteka.uz** — for understanding the consumer side they're competing against (informs how providers should present themselves).
- **Calendly / Cal.com / Fresha / Booksy** — for booking management, schedule UIs, resource timelines.
- **Linear, Vercel dashboard, shadcn/ui examples** — for the visual polish and dense-but-clean dashboard feel.

## Constraints / do not
- Do not design any "self-employed master invites themselves to an organization" flow. Solo masters are simply unaffiliated; their tax status (`YTT` / `Self-employed`) is metadata on their master profile.
- Do not require a master to be in an organization to take bookings. Solo masters can take direct bookings.
- Do not let an organization assign a booking to a master who isn't currently affiliated.
- Do not invent USD prices — use UZS (e.g. `1 200 000 UZS`).
- Do not use emojis in UI copy.
- Do not use heavy gradients, glassmorphism, 3D illustrations.

## Output format expected from you
1. Brief design system summary (colors, typography, spacing, primitives) — must be visually consistent with the Drivers app sibling product.
2. Reusable components section with code.
3. Each screen, in the order listed above, with: screen name, purpose paragraph, primary states (default, loading, empty, error where relevant), and full React + Tailwind + shadcn/ui code.
4. Notes on responsive behavior per screen (mobile vs desktop differences) and on role-aware variants (Master view vs Org admin view) where applicable.

Generate the entire design now. Do not ask clarifying questions; make reasonable choices and document them inline.
