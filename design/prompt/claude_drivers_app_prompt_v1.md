# AI Agent Prompt — Drivers Web App Design

## Your role
You are a senior product designer + frontend engineer. Produce a complete, screen-by-screen design specification for a responsive web application, delivered as **HTML + React (functional components) + TailwindCSS + shadcn/ui** code so the screens can be rendered as visual mockups. For each screen, include a short narrative (purpose, key actions, edge states) followed by the component code. Do not stub screens — every screen listed must be fully designed.

## Product overview
A web-based application for car owners (drivers) that helps them:
1. Find auto services (service centers and individual masters) near them on a map and book appointments.
2. View OBD2 diagnostic data that has been read by a companion mobile app and pushed to the platform. The web app **only displays** OBD2 data; it does not read it.
3. Track manufacturer-recommended maintenance schedules per car (oil change, timing belt, brake fluid, etc.) based on mileage and time, and receive proactive reminders.
4. Manage their cars, bookings, payments, and reviews.

This is the **Drivers** side. There is a separate **Masters** app (out of scope for this prompt) where service providers register and accept bookings.

## Target users
Car owners in Uzbekistan, mostly mobile-first usage (the design must be fully responsive: mobile, tablet, desktop). Mid-tech-literacy. They speak Uzbek primarily, then Russian, then English. The UI must include a language selector (EN / UZ / RU) but for this design pass, **all copy is in English**.

## Design language & system
- Modern, clean, minimal. Inspired by the visual aesthetic of shadcn/ui and Linear / Vercel dashboards.
- Use Tailwind utility classes, shadcn/ui components (`Button`, `Card`, `Dialog`, `Tabs`, `Sheet`, `DropdownMenu`, `Input`, `Form`, `Badge`, `Avatar`, `Calendar`, etc.).
- **Light theme is default. Dark theme must be supported** via Tailwind's `dark:` modifier and a theme toggle in the user menu.
- Typography: Inter or similar geometric sans. Clear hierarchy. Generous whitespace.
- Color: a single restrained accent color (propose one — something automotive but not cliché, e.g. a deep electric blue or graphite + amber). Neutrals dominate. Status colors for success/warning/error/info.
- Rounded corners (`rounded-xl` / `rounded-2xl`), soft shadows, subtle borders. No heavy gradients, no skeuomorphism.
- Iconography: lucide-react.
- Maps: **Yandex Maps**. Show map embeds where relevant; you can mock the map area with a styled placeholder that clearly indicates "Yandex Maps embed here" and shows pin markers.

## Localization & theming requirements
- Every screen must include the global app shell with: logo, primary nav, language selector dropdown (flags + codes EN / UZ / RU), theme toggle (sun/moon icon), notifications bell with unread badge, user avatar dropdown.
- Design strings to be wrap-friendly (anticipate ~30% longer Russian and Uzbek text).

## Information architecture — screens to design
Design every screen below. Each screen must show realistic dummy content (real-looking car makes/models, service names, addresses in Tashkent, prices in UZS).

### A. Authentication
1. **Auth method selector** — a visually striking page where the user chooses how to sign in: "Continue with phone" or "Continue with email". This page should feel premium (hero illustration or subtle car-themed background, two large tappable cards, "Why choose phone vs email?" microcopy).
2. **Phone — enter number** (country code dropdown defaulting to +998, formatted input).
3. **Phone — enter OTP** (6-digit input, resend timer, change number link).
4. **Email — sign in** (email + password, forgot password link, "switch to phone" link).
5. **Email — sign up** (email, password, confirm password, T&C checkbox).
6. **Forgot password** (request reset, then reset form).
7. **Complete profile** (after first signup: full name, optional photo, preferred language).

### B. Main app
8. **Home / Dashboard** — greeting, primary search bar ("What does your car need?"), upcoming booking card (if any), maintenance reminder cards (e.g. "Oil change due in 320 km"), recently viewed services, popular service categories grid, nearby service centers map preview.
9. **My Cars (list)** — grid/list of the user's cars with thumbnail, make/model/year, plate number, next maintenance due, "Add car" CTA.
10. **Add Car** — flow: choose method (VIN scan/input, manual entry, "scan documents"), then form (make, model, year, trim, mileage, plate, fuel type, photo upload).
11. **Car Detail** — hero with car photo, key specs strip (year, mileage, fuel type, engine), and **3 tabs**:
    - **Overview** — quick stats, last service date, current health summary (derived from OBD2 + maintenance), notes.
    - **OBD2 Diagnostics** — see C below.
    - **Maintenance Schedule** — see D below.
    - **Service History** — chronological list of past bookings/services done, each with date, service center, master, cost, invoice link.

### C. OBD2 Diagnostics page (a tab inside Car Detail)
Research reference: look at how Carista, FIXD, and Torque Pro display OBD2 data, and adapt to web.
- **Header strip**: last sync time (from mobile app), device used, "How is OBD2 data collected?" info icon explaining mobile-only reading.
- **Active trouble codes** — list of DTCs (e.g. `P0420 — Catalyst System Efficiency Below Threshold`) with severity badge (critical/warning/info), short plain-English explanation, "Find a master who can fix this" CTA that pre-fills a search.
- **Resolved codes** — collapsible list of historical codes that have cleared.
- **Live data snapshots** — grid of metric cards (RPM, coolant temp, intake air temp, fuel trim, battery voltage, throttle position, vehicle speed) showing the latest reading and a small sparkline.
- **Trends** — selectable metric + time range (24h / 7d / 30d) line chart.
- **Diagnostic sessions** — table of historical sync sessions with timestamp, duration, codes found, mileage at time of read.
- **Empty state** — "No OBD2 data yet. Connect via our mobile app to start tracking." with QR code / app store badges.

### D. Maintenance Schedule page (a tab inside Car Detail)
- **Top summary** — overall maintenance health (e.g. "3 items due soon, 1 overdue"), current mileage (with "update mileage" inline edit).
- **Timeline view** — vertical timeline of upcoming maintenance items, sorted by urgency. Each item is a card: service name (e.g. "Engine oil change"), recommended interval ("Every 10,000 km or 6 months"), status badge (Overdue / Due soon / Upcoming / OK), progress bar showing how close, "Book this service" CTA, "Snooze reminder" / "Mark as done manually" actions.
- **Categories filter chips** — Engine, Transmission, Brakes, Cooling, Electrical, Tires, Filters, Fluids.
- **Past completed maintenance** — collapsible section.
- **Notification preferences** — small inline panel: "Notify me X km / Y days before each item."

### E. Service discovery
12. **Catalog (all services)** — categorized grid of service types (Oil change, Tire service, Body repair, Diagnostics, A/C service, Detailing, etc.), each with icon, short description, "from X UZS" indicative price, count of providers.
13. **Search (map + list)** — split view inspired by arzonapteka.uz / osonapteka.uz: left column is a filterable list of providers (service centers + individual masters), right column is a Yandex Maps embed with pinned markers. Filters: service type, distance, price range, rating, organization type, "open now", offers home service. Mobile: list and map are toggleable tabs.
14. **Service Center detail** — photo gallery, name, type badge (MCHJ / YTT / Self-employed), address with map snippet, hours, phone, services offered with prices, masters working here (avatar list with ratings), reviews tab, "Book" CTA.
15. **Master detail** — avatar, full name, rating (stars + numeric + count of reviews), completed orders count, years of experience, specialties, services with prices, organizations they're affiliated with (Yandex Go-style provenance — show as small pill chips), portfolio photos, reviews tab, "Book" CTA.

### F. Booking
16. **Booking — step 1: choose service** (if not pre-selected from a service or master page).
17. **Booking — step 2: choose provider** (master or center, with comparable cards).
18. **Booking — step 3: choose car** (from user's cars; "add car" inline if none).
19. **Booking — step 4: choose date & time** (calendar + time slot grid showing the provider's availability).
20. **Booking — step 5: details & confirmation** (problem description, photos upload, address if home service, summary card with price breakdown, payment method selector showing two options: "Reserve and pay at the service" and "Pay online now" — the second is **clearly designed but visibly tagged "Coming soon"**).
21. **Booking — payment screen** (card form, saved cards, billing summary). Mark whole screen with a subtle "Future feature" ribbon in this design pass.
22. **Booking — success** (animated checkmark, booking ID, summary, "Add to calendar", "Get directions", "Contact provider").

### G. Order management
23. **My Bookings** — tabs: Upcoming / In progress / Completed / Cancelled. Each card shows service, provider, date/time, status badge, CTA.
24. **Booking detail** — full info, status timeline (Pending → Confirmed → In progress → Completed), provider info, car info, service items, total, action buttons (Reschedule, Cancel, Chat, Get directions, Leave review when completed, Download invoice).
25. **Chat with provider** — simple messaging UI: bubble layout, attachments, quick replies, online status.

### H. Reviews
26. **Leave a review** — star rating, tag chips (e.g. Punctual, Clean work, Good price, Honest), free text, photo upload.
27. **My reviews** — list of reviews the user has written, edit/delete.

### I. Profile & settings
28. **Profile** — personal info edit, profile photo, phone, email, preferred language.
29. **Settings** — Notifications (toggle types: maintenance reminders, booking updates, promo, OBD2 alerts), Theme (Light/Dark/System), Language, Privacy, Data export, Delete account.
30. **Notifications center** — full-page list of all notifications, grouped by date, with type icons (maintenance, booking, message, promo).

### J. Misc
31. **Empty states** — design empty states for: no cars, no bookings, no notifications, no OBD2 data, no maintenance items, no search results.
32. **404 / error page**.
33. **Onboarding modal/tour** for first-time users (3–4 step product tour overlay).

## Reusable components to define explicitly
Before generating screens, define and show these as a reusable component library section: `AppShell`, `Sidebar` (desktop), `BottomNav` (mobile), `TopBar` with language/theme/notif/avatar, `CarCard`, `ProviderCard` (handles both Center and Master variants), `ServiceCard`, `BookingCard`, `MaintenanceItemCard`, `DTCCard`, `MetricCard` (with sparkline), `RatingDisplay` (stars + number + count), `OrgTypeBadge`, `StatusBadge`, `MapEmbedPlaceholder`, `EmptyState`, `Stepper`, `OTPInput`.

## Reference apps (study and adapt)
- **Yandex Go** — for the map-first discovery UX, provider rating display, completed-orders badging, the calm trust-building visual tone.
- **arzonapteka.uz / osonapteka.uz** — for the "find what you need across all providers in one search" pattern with map + filterable list.
- **Carista, FIXD, Torque Pro** — for OBD2 data presentation patterns (DTC cards, live metrics, trends).
- **shadcn/ui examples, Linear, Vercel dashboard** — for visual polish and component density.

## Constraints / do not
- Do not use heavy gradients, glassmorphism, or 3D illustrations.
- Do not place OBD2-reading controls anywhere — the web app is read-only for OBD2.
- Do not design any "self-employed master invites themselves to a fake organization" flow. Solo masters are simply unaffiliated; their tax status is metadata.
- Do not use emojis in UI copy.
- Do not invent prices in USD — use UZS (e.g. `250 000 UZS`).

## Output format expected from you
1. Brief design system summary (colors, typography, spacing scale, component primitives).
2. Reusable components section with code.
3. Each screen, in the order listed above, with: screen name, purpose paragraph, primary states (default, loading, empty, error where relevant), full React + Tailwind + shadcn/ui code.
4. Notes on responsive behavior per screen (mobile vs desktop differences).

Generate the entire design now. Do not ask clarifying questions; make reasonable choices and document them inline.
