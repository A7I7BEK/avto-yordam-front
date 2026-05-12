# AI Agent Prompt — Masters Web App Design (v2)

## Your role
You are a senior product designer + frontend engineer. Produce a complete, screen-by-screen design specification for a responsive web application, delivered as **HTML + React (functional components) + TailwindCSS + shadcn/ui** code so the screens can be rendered as visual mockups. For each screen, include a short narrative (purpose, key actions, edge states) followed by the component code. Do not stub screens — every screen listed must be fully designed.

## Product overview
A web-based application for **service providers** in the auto repair industry. There are two distinct first-class concepts on the platform:

1. **Employee** — a person who performs services or manages an organization. The Employee carries personal, service-side data: name, photo, contact, specialization, self-claimed years of experience, system-tracked experience on the platform, completed orders, rating, reviews, working hours, portfolio.
2. **Organization** — a legal/tax/payment entity that exists in one of three forms: `MCHJ` (Mas'uliyati cheklangan jamiyat), `YTT` (Yakka tartibdagi tadbirkorlik), or `Self Employed` (O‘zini-o‘zi band qilgan shaxs). The Organization carries legal data, address, brand, bank info, online-payment provider integrations (PayMe, Click, Paynet), service catalog selections and pricing, operating hours, team.

Employees join Organizations through **Invitations** (GitLab-style). When accepted, the Employee gets a **Role** inside that Organization. The 4 built-in roles created automatically with every new Organization are:
- **Owner** — full control. Cannot be deleted.
- **Manager** — sees all bookings, manages team and catalog/pricing, but doesn't perform services.
- **Master** — performs services on cars; takes bookings assigned to them.
- **Receptionist** — handles bookings (create, confirm, reschedule, cancel) but doesn't perform services.

The Owner can create additional **custom roles** and define each role's permissions through a dedicated Roles & Permissions page. This is a **role + permission based app**.

A person who wants to work solo must end up as an Employee with a Master role inside a Self Employed Organization owned by themselves. The platform provides a streamlined "Set up solo work" wizard that does both registrations in one pass.

This is the **Masters** side. Out of scope for this prompt: the Drivers (consumer) app, the OBD2-reading mobile app.

## Domain model — design according to this

### Entities
- `Employee` — personal account. Has: full name, photo, phone, email, password, languages, **manual fields** (`Years of Experience`, `Specialization`, `Working hours preference`), **system fields** (`Experience on Platform` = months since first activity, `Completed Orders` = count, `Rating` = 1–5 average). Has no bank info, no tax info.
- `Organization` — legal entity. Has: `type` (`MCHJ` | `YTT` | `Self Employed`), legal name, brand/display name, tax ID, registration docs, address (Yandex Maps pin), contact info, photos, bank info, payment-provider configurations, operating hours, selected catalog services with prices, team (list of Memberships).
- `Membership` — links Employee to Organization with a Role and status. An Employee can have multiple Memberships across different Organizations.
- `Role` — name, description, permissions list, scoped to a single Organization. 4 built-in (Owner, Manager, Master, Receptionist) + custom.
- `Permission` — granular action permissions (e.g. `bookings.confirm`, `team.invite`, `catalog.edit_prices`, `finance.view`, `settings.edit_org`, `roles.manage`).
- `Invitation` — from Organization to phone/email of an Employee (existing or not-yet-registered), with proposed Role. States: pending, accepted, declined, cancelled, expired.
- `Catalog` — platform-curated, read-only for organizations. Tree: `Category` (e.g. "Chassis") → `Subcategory` (e.g. "Brake pads exchange"). Organizations select which subcategories they offer and set a price for each. Organizations cannot create new categories or subcategories.
- `Order` — booking. Lifecycle: `pending` → `confirmed` → `in_progress` → `completed` (with branches to `counter_offered`, `cancelled_by_customer`, `cancelled_by_provider`, `auto_cancelled`, `no_show`). An Order contains: customer, car, requested services (each linked to a catalog subcategory + price snapshot), requested time, location (org address or customer address for home service), notes, photos, assigned Master, total price.
- `CounterOffer` — proposed time change with optional explanation text. Price never changes in a counter-offer; price changes only happen when the Manager edits the Organization's catalog prices upstream. Counter-offers can go back and forth between customer and master.
- `Notification` — first-class event entity, delivered via in-app (mandatory), SMS / Telegram / Email (opt-in, gated by Org-level policy and user-level preference).
- `Transaction` — payment record. Provider (PayMe / Click / Paynet / Cash-at-service), amount, status (initiated / redirected / paid / failed / refunded), timestamps, provider transaction ID.

### Order negotiation behavior (must be visible in the UI)
- Customer requests an Order with a desired time.
- Master can **Accept**, **Decline**, or **Counter-offer a different time** (with optional explanation in a textarea). Price is locked.
- If counter-offered, customer sees the proposal and can Accept, Decline, or Counter-counter.
- **Auto-cancel rule:** whichever side has the ball, they have 24h to act; if no action, the order auto-cancels. The 24h timer resets each time the ball changes sides.

### Catalog browsing flow (must match this)
- Organizations browse a tree: tap a Category card → see Subcategories → multi-select subcategories to offer → set price + duration per selected subcategory.
- Customers (out of scope here) see only subcategories that an Org has selected and priced.

### Authentication entry model
- Single underlying account (Employee).
- Login screen has two tabs: **Master** and **Organization**.
- **Master tab** routes the user into the personal employee view: their assigned orders across all Orgs, their invitations, their public profile.
- **Organization tab** routes the user into an Org management view; if they belong to/own multiple Orgs, they pick which one to enter. Different roles inside an Org see different navigation items based on their permissions.
- A user who has both kinds of activity (a Master at Org A and an Owner of Org B) chooses at login which context to enter. Switching contexts mid-session is done via the top bar.
- Registration mirrors this: "Register as Master" (Employee profile only) or "Register as Organization" (creates Org + auto-assigns the registrant as Owner). A third entry — "I want to work solo" — runs a combined wizard that does both.

## Target users
Auto service professionals in Uzbekistan — workshops, body shops, individual mechanics, mobile masters. Mid-tech-literacy. Mostly desktop usage during work, but the app must be responsive for mobile because masters often check bookings on their phones. Languages: UZ primary, RU, EN. UI must include a language selector (EN / UZ / RU) but **all copy in this design pass is in English**.

## Design language & system
- Modern, clean, professional. Slightly more "tool-like" / dashboard-dense than the Drivers app, but using the same visual DNA so the two products feel like a family.
- Tailwind utility classes + shadcn/ui components (`Card`, `Table`, `DataTable`, `Tabs`, `Sheet`, `Dialog`, `Form`, `Calendar`, `Command`, `DropdownMenu`, `Badge`, `Avatar`, `Toast`, `Popover`, `Switch`, `Checkbox`).
- **Light theme default. Dark theme supported** via Tailwind's `dark:` modifier and a theme toggle in the user menu.
- Typography: Inter or similar geometric sans. Tabular numerals for stats and money.
- Color: a single restrained accent (propose one — deep electric blue or graphite + amber). Status colors for booking states.
- Rounded corners (`rounded-xl`), soft shadows, clear borders. No heavy gradients, no glassmorphism, no 3D illustrations.
- Iconography: lucide-react.
- Maps: **Yandex Maps** (mock the embed area as a styled placeholder when needed).
- Money: UZS, tabular figures, format like `1 200 000 UZS`.

## Localization & theming requirements
- Every authenticated screen shows the global shell: logo, primary navigation (sidebar on desktop, drawer + bottom nav on mobile), context indicator (which Org you're currently in, or "Master view"), language selector, theme toggle, notifications bell with unread count, user avatar dropdown (Profile, Switch context, Log out).
- Strings must be wrap-friendly for ~30% longer translations.

## Information architecture — screens to design

Design every screen below. Use realistic dummy data: Tashkent addresses, UZS prices, Uzbek-style names, plausible service catalog.

### A. Authentication & onboarding
1. **Login / Registration landing** — split with two tabs at the top: **Master** | **Organization**. Beneath the tabs: auth method selector (Continue with phone / Continue with email). The chosen tab determines what registration produces and where login lands.
2. **Phone — enter number** (country code defaults to +998).
3. **Phone — OTP** (6-digit input, resend timer).
4. **Email — sign in** and **Email — sign up** (separate screens).
5. **Forgot password** flow.
6. **Registration path picker** (shown right after first sign-up): three large cards:
   - **I'm a Master** — "I perform auto services and want to receive orders. I'll join an existing organization or work for one later."
   - **I represent an Organization** — "I run or manage a service center / business."
   - **I want to work solo** — "I'll be a master and run my own one-person business (Self Employed). We'll set both up for you in one flow." Tag this option with a small badge "Recommended for individuals".
7. **Master onboarding** — multi-step wizard for Employee profile:
   - Step 1: Personal info (name, photo, phone, email confirmed, DOB).
   - Step 2: Specialization multi-select (Engine, Transmission, Bodywork, Paint, Electrical, Diagnostics, Tires, A/C, etc.).
   - Step 3: Manual `Years of Experience` (numeric input with hint: "We'll also track your verified experience on this platform separately").
   - Step 4: Preferred working hours (weekly schedule editor, used as default when masters set per-org availability later).
   - Step 5: Portfolio (photo upload).
   - Step 6: Review & submit. End state: empty inbox + prompt "You're ready. Wait for an invitation from an organization, or set up your own solo business."
8. **Organization onboarding** — multi-step wizard:
   - Step 1: Org type selector (3 cards: `MCHJ`, `YTT`, `Self Employed`) each with a short legal explanation.
   - Step 2: Legal info (legal name, brand/display name, tax ID, registration docs upload).
   - Step 3: Address (Yandex Maps pin + structured address).
   - Step 4: Contact (phone, email, website, socials).
   - Step 5: Operating hours.
   - Step 6: Photos (storefront, garage, equipment).
   - Step 7: Bank info (account name, account number, bank, MFO, INN — the Org's tax ID confirmed).
   - Step 8: Payment providers (toggle which redirect providers to enable: PayMe, Click, Paynet — each with credential fields and a "Test redirect" button; clearly tagged "Required for online payments" with a note that "Pay at service" is always available without these).
   - Step 9: Service catalog selection (see screen 22).
   - Step 10: Invite first masters (skippable).
   - Step 11: Review & submit.
9. **Solo onboarding (combined)** — single visually unified wizard that interleaves Employee fields and Self-Employed Organization fields, with clear section headers ("About you" then "Your business"). At the end, the system auto-creates the Org, sets the Employee as Owner, and creates a Master role membership for the same person. End state lands them in the Org dashboard.

### B. Dashboards (role-aware)
10. **Master dashboard** (personal view, accessed via Master login tab) — KPI strip (today's bookings, this week's bookings, rating, completed orders, in-progress bookings), today's schedule, pending orders awaiting your response with countdown badges, pending invitations, recent reviews, quick actions (Block time, Update availability, Edit profile). If the user is a Master in multiple Orgs, every order card carries a small Org caption pill on top.
11. **Organization admin dashboard** (Owner / Manager view) — KPI strip (today's bookings org-wide, this week's revenue, active masters, occupancy %, average rating, no-show rate, pending orders), today's schedule across all masters (resource timeline / Gantt-like), bookings needing attention, masters availability summary, recent reviews, quick actions.
12. **Receptionist dashboard** — focused subset: incoming bookings queue, today's schedule, customer chat inbox, walk-in entry CTA. No financial KPIs (unless permissions grant).

### C. Bookings (the core tool)
13. **Bookings — list view** — data table with filters (status, date range, master, service, customer name/phone). Columns: ID, customer, car, services, master assigned, requested time, price, status (with countdown badge for pending), actions. Bulk actions for admins.
14. **Bookings — calendar view** — week/day/month. Admins see resource timeline (one row per master); Masters see only their own.
15. **Order detail** — the core screen. Layout:
    - Left column: customer card (name, phone, photo, customer-side rating), car card (make/model/year/plate/mileage, optional link to OBD2 highlights if customer shared), services list (each with catalog category > subcategory > price + duration), customer notes, attached photos, location.
    - Right column: large status timeline showing every event (`Pending` → `Counter-offered by master` → `Counter-counter-offered by customer` → `Confirmed` → `In progress` → `Completed`), each entry with timestamp and actor. Auto-cancel rule explanation inline with an info icon: "Orders auto-cancel if not responded to within 24 hours. The timer resets each time the other side responds."
    - Action panel: contextual buttons depending on current state and viewer's permissions: **Accept**, **Decline**, **Propose different time**, **Reassign master**, **Mark in-progress**, **Mark completed**, **Mark no-show**, **Cancel**, **Issue invoice**.
    - Internal notes section (team-only).
    - Chat panel with customer.
    - Transactions section: list of any payment attempts and the final paid transaction, with provider badge (`PayMe`, `Click`, `Paynet`, or `Cash at service`), amount, timestamp, provider transaction ID, status.
16. **Pending order — countdown badge component** — must be designed: a pill showing time remaining ("Auto-cancels in 14h 23m"), color-shifting as it gets closer to zero (neutral → amber under 6h → red under 1h). Plus a small caption under the order card on list views: "Auto-cancels if no response in 24h."
17. **Counter-offer dialog** — date+time picker (showing master's existing availability as visual context), optional explanation textarea (placeholder: "Why this time? — e.g. I have another job until 2pm"), "Send proposal" CTA. After sending, the order status updates to `Counter-offered` and the responsibility shifts.
18. **Counter-offer received view (customer side, simulated here for design)** — show how the proposal renders for the customer in our system so designers think through both sides: shows original time strikethrough, proposed time highlighted, master's note in a quote block, Accept / Decline / Counter buttons.
19. **Auto-cancelled order view** — status badge "Auto-cancelled", a clear banner explaining "No response received within 24 hours. The order has been cancelled automatically." Audit trail shows last actor and time of inaction. Buttons: "Recreate as new order" (if appropriate).
20. **New booking (manual entry by Receptionist / Manager for walk-ins or phone calls)** — customer search-or-create, car search-or-create, services picker (from the Org's selected catalog, prices auto-fill), master assignment, requested time, notes.
21. **Reschedule dialog** and **Decline dialog** (decline requires a reason from a short dropdown + optional text).

### D. Catalog & Services (organization-side)
22. **Catalog — browse & select** — for Owners/Managers configuring what the Org offers. Page layout:
    - Tree browser on the left: Categories list, each with subcategory count badge. Selecting a Category shows its Subcategories grid on the right.
    - Subcategory card: name, short description, suggested duration, this Org's current price (or "Not offered" state), toggle to add/remove from offering.
    - Bulk selection: multi-select subcategories, then bulk-set durations or use a CSV-style price editor.
    - Make it visually clear that **categories and subcategories are platform-curated and read-only**. Show this with a small "Curated by platform" badge in the header and an info tooltip: "Categories and services are maintained by the platform to keep search and comparison consistent across providers. Prices are set by your organization."
23. **My services (offered)** — table of currently offered subcategories with category, name, price, duration, description, status, last edited. Edit price/duration inline. Bulk archive.
24. **Pricing dialog** — per service: price (UZS), duration (minutes), optional notes for masters.

### E. Schedule
25. **My schedule (Master view)** — weekly working hours editor per Org (tabs for each Org they belong to), time-off blocks, capacity per day.
26. **Organization schedule (Admin view)** — set org operating hours, holidays, and per-master overrides. Resource timeline preview.

### F. Team & invitations
27. **Team roster (Org admin)** — table of Memberships: avatar, name, role, specialties, rating, completed orders (system, on this platform), status (active/suspended), join date, actions (View profile, Change role, Suspend, Remove). Search and filter.
28. **Invite a team member** — modal: enter phone or email, pick a Role from the Org's role list, optional services subset they can perform (only meaningful for Master role), optional welcome message. "Send invitation". The invited person sees this in their Master-view Invitations inbox (regardless of which role they're invited to).
29. **Sent invitations** — list with pending / accepted / declined / expired statuses; resend, cancel, copy invitation link actions.
30. **My invitations inbox (Master view)** — incoming invitations cards: Org logo, brand name, type badge (`MCHJ` / `YTT` / `Self Employed`), proposed role, services scope (if Master role), Org address, welcome message, Accept / Decline buttons.

### G. Roles & Permissions (Org admin, gated by `roles.manage` permission)
31. **Roles list** — cards or table for each Role: role name, description, member count, "Built-in" badge for the 4 base roles. Built-in roles can be renamed and have their permissions edited (with warnings on Owner), but not deleted. Custom roles can be deleted. Primary CTA: "Create new role".
32. **Create / edit role** — form: role name, description, then a permissions matrix grouped by area:
    - **Bookings** — view all, view own, create, accept, decline, counter-offer, reassign master, mark in-progress, mark completed, mark no-show, cancel, issue invoice.
    - **Team** — view roster, invite, change roles, suspend, remove, view sensitive contact info.
    - **Catalog & pricing** — view, edit selections, edit prices.
    - **Schedule** — view all, edit own, edit others.
    - **Finance** — view transactions, view earnings dashboard, configure payment providers, edit bank info, export reports.
    - **Customers** — view customer contact info, chat with customers.
    - **Settings** — edit org profile, edit operating hours, edit notification policy, manage roles, deactivate org.
    Each permission is a checkbox. Show a live "Members with this role" sidebar so the editor sees impact. Provide a "Duplicate this role" shortcut.
33. **Role detail / impact view** — list of members holding this role, and a read-only summary of permissions.

### H. Profile & public presence
34. **Employee public profile editor** — preview pane on the right showing how the Master appears to drivers in the Drivers app. Editable: photo, bio, specialization tags, manual `Years of Experience`, portfolio. Read-only / system-shown: `Experience on Platform`, `Completed Orders`, `Rating`. The two experience numbers appear as two distinct lines on the preview, both clearly labeled, so the driver sees both.
35. **Organization public profile editor** — preview pane on the right. Editable: photos, brand name, description, address, hours, services preview, masters list preview. Org type badge (`MCHJ` / `YTT` / `Self Employed`) shown clearly.

### I. My Organizations (Master view) — payment-card-style page
36. **My Organizations** — list of Organizations the Employee belongs to, rendered as **stacked card visuals reminiscent of payment-provider card lists (think Apple Pay's "Cards" or PayMe's saved cards)**:
    - Each card shows Org logo / accent color band, Org brand name, type badge (`MCHJ` / `YTT` / `Self Employed`), role inside this Org, joined date, brief address.
    - Tap a card → Org detail page (read-only from the Master's perspective): full Org info, the services this Master is allowed to perform here, the role's permissions summary, working hours overrides, "Leave organization" destructive action.
    - Primary CTA: "Add organization" — opens the Invitations inbox (you join orgs by accepting invitations, not by adding them directly).
    - Empty state: "You don't belong to any organization yet. Wait for an invitation or set up your own solo business."

### J. Reviews & reputation
37. **Reviews received** — list with rating distribution chart, filter by rating, reply to review, flag inappropriate. Available in two views: per-Master (in Master view) and org-wide (in Org admin view).
38. **Reputation overview** — rating trend over time, completed orders count, response rate, on-time rate, no-show rate, average counter-offer rate.

### K. Earnings & payments
39. **Earnings overview (Org admin)** — charts by week/month, breakdown by service category, by master, top customers. Data sources include online payments (PayMe / Click / Paynet) and cash-at-service entries marked as collected.
40. **Transactions (Org admin)** — table of payment records: order ID, customer, amount, provider badge, status, timestamps, provider transaction ID, actions (view detail, request refund — last one tagged "Coming soon" if not yet supported).
41. **Transaction detail** — full provider response, redirect history, payer info, link to the originating Order.
42. **Payment providers setup** — page within Settings showing each provider (PayMe, Click, Paynet) as a card: enabled toggle, credential fields, test-redirect button, last successful charge, last error. Mark refunds as future feature with a subtle ribbon.
43. **Bank info** — Org bank account form (legal entity name, account number, bank name, MFO, INN). Only visible to roles with `finance.edit_bank_info`. Employees as Employees do not have bank info.

### L. Settings
44. **Account settings (Employee)** — personal info, phone, email, password, two-factor, languages, delete account.
45. **Organization settings (Admin)** — legal info, brand, address (with Yandex Maps pin), operating hours, photos, danger zone (deactivate org). Each section gated by relevant permissions.
46. **Notification policy (Org admin)** — controls which channels are allowed at the Org level. In-app is always on and shown as a non-editable row. Below it, toggles for SMS, Telegram, Email, each defaulting to **off**. Brief explainer: "When a channel is off here, individual members cannot enable it for themselves."
47. **My notification preferences (per user)** — per-event-type matrix (`New order received`, `Order confirmed`, `Order counter-offered`, `Order auto-cancelled`, `Invitation received`, `Review received`, `Payout completed`, etc.) × per-channel (`In-app`, `SMS`, `Telegram`, `Email`). Channels disabled by the Org policy show greyed-out with a small lock icon and tooltip "Disabled by organization".
48. **Appearance & language** — Theme (Light/Dark/System), Language (EN/UZ/RU).
49. **Privacy & data**.

### M. Notifications & misc
50. **Notifications center** — full-page list grouped by date, with type icons, source pill ("from Org X"), unread/read state.
51. **Empty states** — design for: no bookings, no team members, no invitations sent, no invitations received, no reviews, no transactions, no services selected from catalog, no organizations (Master view), no custom roles.
52. **404 / error page**.
53. **Context switcher (top bar)** — popover triggered from the current-context indicator showing all available contexts: "Master view" + one entry per Org the user has admin access to. Includes "Add organization" and "Become a master" shortcuts.

## Reusable components to define explicitly
Define and show these as a reusable component library section before generating screens: `AppShell`, `Sidebar` (collapsible, role-aware), `MobileBottomNav`, `TopBar`, `ContextSwitcher`, `KpiCard`, `BookingCard` (with countdown badge variant), `BookingStatusBadge`, `CountdownBadge`, `OrgTypeBadge` (`MCHJ` / `YTT` / `Self Employed`), `RoleBadge` (built-in + custom variants), `EmployeeCard`, `OrganizationCard` (payment-card-style visual), `InvitationCard`, `RatingDisplay`, `ExperienceDisplay` (renders both manual + system lines), `CatalogTreeBrowser`, `SubcategoryPickCard`, `PermissionMatrix`, `WorkingHoursEditor`, `Stepper`, `OTPInput`, `EmptyState`, `MapEmbedPlaceholder`, `ResourceTimeline`, `MoneyCell`, `PaymentProviderBadge` (`PayMe` / `Click` / `Paynet` / `Cash`), `TransactionRow`.

## Reference apps
- **Yandex Go (partner)** — for partner-facing rating, completed orders display, calm tone.
- **GitLab** — for the role/permission/membership/invitation pattern.
- **Calendly / Cal.com / Fresha / Booksy** — for booking management, schedule, resource timelines, counter-offer-style negotiation patterns.
- **Apple Pay / PayMe / Click** — for the "My Organizations" stacked-cards visual treatment.
- **arzonapteka.uz / osonapteka.uz** — for the consumer-side competition (informs how providers should present).
- **Linear, Vercel dashboard, shadcn/ui examples** — for visual polish and dashboard density.

## Constraints / do not
- Do not let Organizations create or edit catalog Categories or Subcategories. Catalog is read-only platform data; Organizations only select which subcategories to offer and set price/duration.
- Do not allow Masters to change the price during counter-offer. Counter-offer changes time only, with optional explanation text.
- Do not put bank info or tax type on the Employee. They belong on Organization only.
- Do not skip the 24h auto-cancel UI: every pending order list and detail view must surface the countdown and the rule.
- Do not require an Employee to belong to an Organization to register or have a profile. But to take real bookings as a solo worker, they need a Self-Employed Org — the solo wizard handles this.
- Do not invent USD prices — use UZS (e.g. `1 200 000 UZS`).
- Do not use emojis in UI copy. No heavy gradients, no glassmorphism, no 3D illustrations.

## Output format expected from you
1. Brief design system summary (colors, typography, spacing, primitives).
2. Reusable components section with code.
3. Each screen in the order listed above, with: screen name, purpose paragraph, primary states (default, loading, empty, error where relevant), and full React + Tailwind + shadcn/ui code.
4. Notes on responsive behavior per screen and on role-aware variants (Master view vs Owner vs Manager vs Receptionist).

Generate the entire design now. Do not ask clarifying questions; make reasonable choices and document them inline.
