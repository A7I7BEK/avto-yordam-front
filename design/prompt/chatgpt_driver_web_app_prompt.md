# Driver Web App — AI Design Prompt

Design a modern, clean, desktop-first responsive **web app** for car drivers to discover, compare, and reserve auto services.

## Product goal
Create a polished marketplace-style experience where drivers can:
- find nearby auto services quickly,
- compare providers by rating, price, distance, and availability,
- reserve a visit,
- view vehicle history and maintenance schedules,
- see OBD2 diagnostics data that is **received from the mobile app**, not collected in this web app.

## Style direction
- Modern and clean UI inspired by **shadcn/ui** and **Tailwind CSS**
- Light theme as default
- Dark theme available
- Rounded cards, subtle shadows, spacious layout
- Clear hierarchy, minimal clutter, premium but practical feel
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
- Use a map-first discovery pattern similar to **Yandex Go** for service browsing, ratings, and transparency
- Use a map + list structure similar to **arzonapteka.uz** and **osonapteka.uz**
- Prefer **Yandex Map** styling and behavior for the map experience

## Main pages and sections

### 1) Landing / Home
- Search bar for services
- Quick service categories
- Nearby services
- Recommended services
- Clear CTA to reserve a service

### 2) Authentication
- Welcome page
- Choice between phone OTP and email/password
- Sign up / sign in screens
- Clean, modern, confidence-building design

### 3) Driver Dashboard
- Upcoming reservations
- Recently visited services
- Saved cars
- Maintenance reminders
- Diagnostics summary cards

### 4) Service Discovery
- Search page
- Filters:
  - distance
  - rating
  - price
  - service type
  - availability
- Result cards with:
  - service name
  - organization/master name
  - rating
  - location
  - approximate price
  - open/closed state

### 5) Map View
- Yandex Map style map panel
- Pins for service locations
- Side list of matching services
- Hover/click pin interactions
- Support sorting and filtering while map remains visible

### 6) Service Details
- Service description
- Photos
- Ratings and reviews
- Services offered
- Location and contact info
- Available time slots
- Reserve button
- Reservation summary

### 7) Reservation Flow
Design both the current and future booking states:
- Current state: **reservation only**
- Future state: reservation + online payment
Include a UI structure that can later support:
- estimated price
- deposit or full payment
- payment method selection
- payment status

### 8) My Cars
- Add and manage multiple cars
- Fields:
  - brand
  - model
  - year
  - VIN or plate number
  - engine type
- Car-specific history and maintenance data

### 9) Diagnostics Data History
This web app does **not** read OBD2 directly.
It should only display diagnostics data **received from the mobile app**.

Show:
- latest diagnostic status
- history timeline
- DTC/error codes
- issue severity
- past scans
- linked car and timestamp

### 10) Manufacturer Maintenance Schedule
This is what the user calls “factory diagnostics history”.

Design a dedicated area for:
- manufacturer-recommended maintenance intervals
- reminders based on mileage or time
- examples:
  - oil change every X km or X months
  - timing belt every Y km
  - brake inspection every Z km
- status indicators:
  - due soon
  - overdue
  - completed
- a timeline or checklist layout works well here

### 11) Notifications
- Maintenance reminders
- Reservation updates
- Price or availability alerts
- Future-ready notification center

## Key UI components to include
- Top navigation with language selector and auth state
- Search input with autocomplete
- Filter drawer or panel
- Map + list split layout
- Service cards
- Reservation modal or dedicated booking page
- Maintenance timeline cards
- Diagnostics cards and status chips
- Empty states and loading states

## Important design constraints
- Keep the layout intuitive and easy to scan
- Show trust signals everywhere:
  - rating
  - completed visits
  - verified provider status
  - availability
- Make the maintenance schedule feature feel useful, not technical
- Keep future online payment support visible in the design, but secondary to reservation
- Do not design native mobile OBD2 reading features here; only show the data that arrives from the mobile app

## Output expectation
Generate a high-fidelity, modern web app design for the driver side with a clear information architecture and polished component-level UI.
