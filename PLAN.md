# 🧭 WanderMate — Master Project Plan

> **Stack**: React 19 (Vite) + Convex Backend + Clerk Auth + Framer Motion
> **Last Updated**: February 27, 2026

---

## 📌 Table of Contents

1. [What is WanderMate?](#1-what-is-wandermate)
2. [Current Project Audit](#2-current-project-audit)
3. [Tech Stack (Planned)](#3-tech-stack-planned)
4. [Design Vision](#4-design-vision)
5. [Convex Database Schema](#5-convex-database-schema)
6. [Route Map](#6-route-map)
7. [Phase 1 — Setup & Foundation](#phase-1--setup--foundation-week-1)
8. [Phase 2 — Landing Page & Onboarding](#phase-2--landing-page--onboarding-weeks-23)
9. [Phase 3 — Trip Management](#phase-3--trip-management-week-4)
10. [Phase 4 — Discovery & Matching Engine](#phase-4--discovery--matching-engine-weeks-56)
11. [Phase 5 — Chat & Matches](#phase-5--chat--matches-weeks-78)
12. [Phase 6 — Polish & Production](#phase-6--polish--production-weeks-910)
13. [Suggested Feature Improvements](#13-suggested-feature-improvements)
14. [Timeline Summary](#14-timeline-summary)
15. [Final Dependency List](#15-final-dependency-list)

**Plan 2 — After Matching** 16. [Current State & Gaps](#p2-1-current-state--gaps) 17. [Architecture Overview](#p2-2-architecture-overview) 18. [Phase 7 — Trip Collaboration Hub](#p2-phase-7--trip-collaboration-hub) 19. [Phase 8 — Trust, Safety & Verification](#p2-phase-8--trust-safety--verification) 20. [Phase 9 — Post-Trip Closure](#p2-phase-9--post-trip-closure) 21. [Phase 10 — Enhanced Chat & Communication](#p2-phase-10--enhanced-chat--communication) 22. [Database Schema Additions](#p2-database-schema-additions) 23. [New Routes](#p2-new-routes) 24. [Plan 2 Timeline](#p2-timeline)

---

## 1. What is WanderMate?

**WanderMate** is a travel companion matching web application — think _"Tinder for travel partners"_.

- Users register with personal preferences (budget style, diet, language, travel vibe, interests)
- They post upcoming trips with destination, dates, and activity preferences
- The app uses a **compatibility scoring algorithm** to surface well-matched co-travelers
- Matched users can chat in real-time and plan their trip together

---

## 2. Current Project Audit

### 2.1 — Current Folder Structure

```
WanderMate/
├── client/                    ✅ React (Create React App)
│   └── src/
│       ├── App.js             ← Root router (8 routes)
│       ├── api.js             ← Fetch-based API layer → localhost:5000
│       ├── index.js           ← Entry point
│       ├── index.css          ← Minimal base styles
│       ├── App.css            ← CRA default styles
│       └── components/
│           ├── Login.jsx      ← Username/password login
│           ├── Register.jsx   ← Rich registration form
│           ├── Home.jsx       ← Dashboard (Bootstrap navbar)
│           ├── NewTrip.jsx    ← Create a trip form
│           ├── FindMate.jsx   ← Browse potential companions
│           ├── Matches.jsx    ← Mutual matches + TalkJS chat
│           ├── Profile.jsx    ← User info + trip history
│           ├── FullScreenChat.jsx  ← Local chat with PDF export
│           └── ErrorPage.jsx  ← Generic error display
└── server/                    🔴 EMPTY — no backend built yet
```

### 2.2 — Existing API Functions (`api.js`)

| Function                 | Method | Endpoint         | Status                |
| ------------------------ | ------ | ---------------- | --------------------- |
| `loginUser(credentials)` | POST   | `/auth/login`    | Defined, not backed   |
| `registerUser(data)`     | POST   | `/auth/register` | Defined, not backed   |
| `getMyTrips()`           | GET    | `/trips/my`      | Defined, never called |
| `addTrip(data)`          | POST   | `/trips/new`     | Defined, not backed   |
| `getMatches()`           | GET    | `/matches`       | Defined, never called |
| `likeUser(palId)`        | POST   | `/matches/like`  | Defined, never called |

### 2.3 — Existing Pages Summary

| Page                 | Route        | Purpose                   | Issues                         |
| -------------------- | ------------ | ------------------------- | ------------------------------ |
| `Login.jsx`          | `/login`     | Auth form                 | API not backed                 |
| `Register.jsx`       | `/register`  | Profile creation          | `onRegister` prop never passed |
| `Home.jsx`           | `/`          | Dashboard + trip selector | Props never passed from App.js |
| `NewTrip.jsx`        | `/new_trip`  | Create a trip             | `onSubmit` prop never passed   |
| `FindMate.jsx`       | `/find_mate` | Browse matches            | Data never fetched             |
| `Matches.jsx`        | `/matches`   | Mutual matches            | TalkJS App ID is placeholder   |
| `Profile.jsx`        | `/profile`   | User info                 | Props never passed             |
| `FullScreenChat.jsx` | `/chat`      | Local-only chat           | Not connected to any server    |
| `ErrorPage.jsx`      | _(unused)_   | Error display             | Not used as a route            |

### 2.4 — Critical Issues Found

| #   | Issue                                                                 | Severity    |
| --- | --------------------------------------------------------------------- | ----------- |
| 1   | `server/` directory is completely empty — no backend                  | 🔴 Critical |
| 2   | No global state — `App.js` passes zero props to any component         | 🔴 Critical |
| 3   | `onRegister` and `onSubmit` callbacks never wired in `App.js`         | 🔴 Critical |
| 4   | TalkJS App ID is `YOUR_TALKJS_APP_ID` placeholder                     | 🟠 High     |
| 5   | No authentication route guards — all pages are publicly accessible    | 🟠 High     |
| 6   | `getMatches`, `getMyTrips`, `likeUser` defined but never called       | 🟡 Medium   |
| 7   | Inconsistent branding — "EXPLORE HUB" vs "WanderMate", two logo paths | 🟡 Medium   |
| 8   | `FullScreenChat` uses `sessionStorage` only — no real chat            | 🟡 Medium   |
| 9   | Minimal CSS — no design system, relies entirely on Bootstrap classes  | 🟢 Low      |

### 2.5 — What Will Be Reused

- `jsPDF` dependency (chat export)
- The core component ideas (Login, Register, NewTrip, FindMate, Matches, Profile, Chat)
- The route concept (`/login`, `/register`, `/`, `/new_trip`, etc.)

### 2.6 — What Will Be Replaced / Rebuilt

- **Backend**: Entire Express backend → replaced by **Convex** (serverless, real-time)
- **Auth**: Custom username/password → replaced by **Clerk** (OAuth, email, social login)
- **Chat**: TalkJS + local sessionStorage chat → **Convex real-time subscriptions** (custom built)
- **State**: No state → **React Context + Convex `useQuery`/`useMutation` hooks**
- **Bundler**: Create React App → **Vite** (faster, modern)
- **Styling**: Bootstrap class spam → **Vanilla CSS design system** + Framer Motion

---

## 3. Tech Stack (Planned)

| Layer            | Technology          | Purpose                                           |
| ---------------- | ------------------- | ------------------------------------------------- |
| **Frontend**     | React 19 + Vite     | UI framework                                      |
| **Routing**      | React Router DOM v7 | Client-side navigation                            |
| **Auth**         | Clerk               | Sign up, sign in, session management              |
| **Backend / DB** | Convex              | Serverless backend, real-time DB, file storage    |
| **Animations**   | Framer Motion       | Page transitions, swipe cards, micro-interactions |
| **Icons**        | Lucide React        | Clean icon set                                    |
| **Toasts**       | Sonner              | Notification toasts                               |
| **PDF Export**   | jsPDF               | Export chat history                               |
| **Dates**        | date-fns            | Date formatting and calculations                  |
| **Utilities**    | clsx                | Conditional class name merging                    |

---

## 4. Design Vision

> WanderMate should feel like a **premium travel lifestyle app** — think Airbnb meets Tinder, with the visual sophistication of Linear.app.

### 4.1 — Color Palette

```
Background Primary:  #0A0F1E  (deep navy)
Background Card:     rgba(255,255,255,0.04)  (glass effect)
Card Border:         rgba(255,255,255,0.08)
Primary Accent:      #00D4AA  (electric teal)
Secondary Accent:    #FF6B35  (sunset orange)
Tertiary Accent:     #7B68EE  (soft lavender)
Highlight:           #FFD700  (gold — for match/achievement moments)
Text Primary:        #F0F4FF
Text Secondary:      #8892A4
```

### 4.2 — Typography

- **Headings**: `Syne` (bold, geometric — from Google Fonts)
- **Body**: `Inter` (clean, readable — from Google Fonts)

### 4.3 — Design Style

- **Glassmorphism** cards: `backdrop-filter: blur(20px)` + semi-transparent backgrounds
- **Gradient mesh** animated SVG backgrounds on key pages
- **Parallax scroll** effects on the landing page
- **Spring physics** animations on card interactions (Framer Motion)
- **Staggered list reveals** — items animate in one-by-one on load
- **Hover microanimations** — every interactive element responds

### 4.4 — CSS Design Tokens

```css
:root {
  --bg-primary: #0a0f1e;
  --bg-secondary: #0f1629;
  --bg-card: rgba(255, 255, 255, 0.04);
  --border-card: rgba(255, 255, 255, 0.08);
  --color-teal: #00d4aa;
  --color-orange: #ff6b35;
  --color-lavender: #7b68ee;
  --color-gold: #ffd700;
  --text-primary: #f0f4ff;
  --text-secondary: #8892a4;
  --radius-card: 20px;
  --blur-glass: blur(20px);
  --shadow-glow: 0 0 40px rgba(0, 212, 170, 0.15);
}
```

---

## 5. Convex Database Schema

```ts
// convex/schema.ts

users: {
  clerkId: string,                          // Clerk user ID
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  dob: string,
  gender: string,
  bio: string,                              // Short intro paragraph
  avatarUrl: string,                        // Convex file storage URL
  financialNature: "spender"|"normal"|"saver",
  dietaryRestrictions: string[],            // Multi-select
  languages: string[],                      // Multi-select
  travelStyles: string[],                   // Backpacker/Luxury/Adventure/Cultural...
  interestTags: string[],                   // Photography/Hiking/Foodie/Nightlife...
  travelerType: string,                     // Vibe check result: Adventurer/Foodie/etc.
  isVerified: boolean,
  createdAt: number,
}

trips: {
  userId: Id<"users">,
  destination: string,
  country: string,
  startDate: string,
  endDate: string,
  natureTrip: string,
  tripPreferences: string[],                // Multi-select activities
  budget: "budget"|"mid-range"|"luxury",
  groupSize: number,                        // How many more spots available
  coverImageUrl: string,                    // Trip cover photo
  status: "planning"|"active"|"completed",
  isPublic: boolean,
  createdAt: number,
}

likes: {
  fromUserId: Id<"users">,
  toUserId: Id<"users">,
  tripId: Id<"trips">,
  createdAt: number,
}

matches: {
  userAId: Id<"users">,
  userBId: Id<"users">,
  tripId: Id<"trips">,
  compatibilityScore: number,
  createdAt: number,
}

messages: {
  matchId: Id<"matches">,
  senderId: Id<"users">,
  text: string,
  imageUrl?: string,                        // Optional image attachment
  isRead: boolean,
  createdAt: number,
}

notifications: {
  userId: Id<"users">,
  type: "new_match"|"new_message"|"trip_like",
  data: any,
  isRead: boolean,
  createdAt: number,
}
```

---

## 6. Route Map

```
/                        → Landing page (public)
/sign-in                 → Clerk sign-in
/sign-up                 → Clerk sign-up
/onboarding              → Post-signup onboarding wizard

/app                     → Protected shell layout (sidebar + tab bar)
/app/home                → Dashboard
/app/discover            → Swipe / Browse potential mates
/app/trips               → My trips list
/app/trips/new           → Create new trip form
/app/trips/:id           → Trip detail page
/app/matches             → Matches list + chat sidebar
/app/chat/:matchId       → Full chat view
/app/profile             → My profile
/app/profile/edit        → Edit profile
/app/notifications       → Notification center
```

---

## Phase 1 — Setup & Foundation (Week 1)

**Goal**: Skeleton app with auth, routing, and design system wired up.

### Step 1.1 — Initialize with Vite

```bash
cd WanderMate
npm create vite@latest client-v2 -- --template react
cd client-v2
npm install
```

### Step 1.2 — Install All Dependencies

```bash
npm install convex @clerk/clerk-react react-router-dom framer-motion
npm install lucide-react sonner jspdf date-fns clsx
```

### Step 1.3 — Initialize Convex

```bash
npx convex dev
# Follow prompts: create project, generates convex/ folder
```

### Step 1.4 — Clerk Setup

- Create project at [clerk.dev](https://clerk.dev)
- Add `VITE_CLERK_PUBLISHABLE_KEY` to `.env.local`
- Wrap `main.jsx` with `<ClerkProvider>` + `<ConvexProviderWithClerk>`

### Step 1.5 — Folder Structure (New)

```
client-v2/src/
├── main.jsx
├── App.jsx               ← Router + providers
├── styles/
│   ├── tokens.css        ← Design system variables
│   ├── globals.css       ← Base reset + utility classes
│   └── components.css    ← Shared component styles
├── components/
│   ├── ui/               ← Reusable atoms: Button, Input, Card, Badge, Avatar
│   ├── layout/           ← Sidebar, BottomNav, Shell, Header
│   └── shared/           ← TripCard, UserCard, MatchCard, etc.
├── pages/
│   ├── Landing.jsx
│   ├── Onboarding.jsx
│   ├── Home.jsx
│   ├── Discover.jsx
│   ├── Trips.jsx
│   ├── NewTrip.jsx
│   ├── TripDetail.jsx
│   ├── Matches.jsx
│   ├── Chat.jsx
│   ├── Profile.jsx
│   └── EditProfile.jsx
├── hooks/                ← Custom hooks: useCurrentUser, useMatches, useTrips
├── lib/                  ← Utilities: scoring.js, dates.js, constants.js
└── convex/               ← Auto-generated + custom functions
    ├── schema.ts
    ├── users.ts
    ├── trips.ts
    ├── likes.ts
    ├── matches.ts
    ├── messages.ts
    └── notifications.ts
```

### Step 1.6 — Shell Layout

- Left sidebar (desktop): Logo, nav links, user avatar, notification bell
- Bottom tab bar (mobile): 5 tabs with icons + labels
- Animated active indicator (sliding underline / pill)
- Protected route wrapper: redirect to `/sign-in` if not authenticated

**✅ Phase 1 Done When**: App loads, sign up / sign in works via Clerk, shell layout renders, design tokens applied.

---

## Phase 2 — Landing Page & Onboarding (Weeks 2–3)

**Goal**: Jaw-dropping first impression + seamless onboarding that creates a full user profile.

### Step 2.1 — Landing Page Sections

1. **Hero Section**
   - Full-screen animated gradient mesh background (CSS `@keyframes` radial gradient shift)
   - Large headline with typewriter cycling: _"Find your perfect travel partner"_ / _"Explore the world, together"_ / _"Never travel alone again"_
   - Sub-headline + two CTAs: **Get Started** (teal, filled) + **See How It Works** (ghost)
   - Floating 3D-style profile cards on the right (CSS `perspective` + `rotateY` on hover)

2. **How It Works** — 3 animated steps with icons + connector line
   - ① Register your preferences
   - ② Post your upcoming trip
   - ③ Match, chat & go!

3. **Featured Destinations** — Horizontal scrollable carousel
   - Cards: destination photo, city name, country flag, "X active trips" count
   - Hover: card lifts + image zooms slightly

4. **Compatibility Preview** — Animated demo showing two profile cards with a % meter filling up

5. **Testimonials** — Glassmorphism quote cards, auto-rotating carousel

6. **CTA Banner** — Full-width gradient section, large CTA

7. **Footer** — Links, socials, tagline _"The world is better with a mate."_

### Step 2.2 — Onboarding Wizard (7 Steps)

Progress bar fills with teal gradient. Each step slides in from the right.

```
Step 1: Basic Info
  → First name, Last name, Username, Date of birth, Gender

Step 2: Your Bio
  → Textarea (max 200 chars) with live character counter
  → Placeholder: "Tell future mates what kind of traveler you are..."

Step 3: Avatar Upload
  → Drag & drop zone or click to browse
  → Circular preview with teal ring
  → Upload to Convex file storage

Step 4: Travel Style (multi-select cards)
  → Backpacker 🎒 / Budget Explorer 💸 / Comfort Seeker 🛏️
  → Adventure Seeker 🧗 / Luxury Traveler ✈️ / Cultural Immersionist 🎭

Step 5: Preferences (chips)
  → Dietary: Omnivore / Vegetarian / Vegan / Halal / Kosher / Gluten-free
  → Languages: Searchable tag input
  → Financial nature: 3-stop visual slider (Saver ← → Spender)

Step 6: Interest Tags (tag cloud)
  → Photography 📷 / Hiking 🥾 / Street Food 🍜 / Nightlife 🎉
  → Museums 🏛️ / Water Sports 🤿 / Road Trips 🚗 / Wildlife 🦁
  → Yoga & Wellness 🧘 / Shopping 🛍️ / Music 🎵 / History 📚
  → Select at least 3, max 10

Step 7: Your WanderMate Card (Preview)
  → Animated reveal of how your profile card looks to others
  → Shows avatar, name, age, traveler type badge, interest tags
  → "This is how mates will see you!"
  → Finish button → saves user to Convex, navigates to /app/home
```

**✅ Phase 2 Done When**: Landing page is live, new sign-ups complete full onboarding, user document saved in Convex `users` table.

---

## Phase 3 — Trip Management (Week 4)

**Goal**: Users can create, view, and manage their trips.

### Step 3.1 — My Trips Page (`/app/trips`)

**Layout**: Card grid — 3 cols (desktop), 2 cols (tablet), 1 col (mobile)

**Trip Card UI**:

- Cover image (destination photo — pull from Unsplash API by keyword or user-uploaded)
- Destination + country flag emoji (top-left overlay badge)
- "X days away" or "🟢 In Progress" status pill (top-right)
- Budget tier icon chip: 💸 Budget / 💰 Mid-range / ✈️ Luxury
- Trip nature tags: nature_trip + trip_preferences as colored chips
- Date range: `Mar 5 → Mar 15` with a mini duration badge `10 days`
- Bottom action bar: **Edit** | **Delete** | **Find Mate** (glows teal on hover)

**Empty state**: Animated SVG suitcase with bouncing character + "Plan your first adventure" CTA

### Step 3.2 — Create New Trip (`/app/trips/new`)

Animated multi-section form (sections expand as you fill):

```
Section 1: Destination
  → Type-ahead autocomplete input with country flag
  → Autofills country field

Section 2: Dates
  → Custom dual inline calendar (start → end)
  → Highlights trip range in teal
  → Shows "X days trip" counter

Section 3: Trip Vibe (illustrated card grid)
  → 🏙️ Urban City   🏕️ Wilderness   🏖️ Beach
  → 🏔️ Mountains    🎭 Heritage     🍷 Luxury

Section 4: Activities (multi-select chip list)
  → Street Food / Clubbing / Museums / Hiking
  → Photography / Water Sports / Shopping / Wildlife

Section 5: Budget
  → 3-stop visual slider: Budget → Mid-range → Luxury
  → Shows estimated daily spend range per level

Section 6: Group Size
  → "How many travel companions are you looking for?"
  → +/- stepper (1–5)

Section 7: Cover Photo
  → Auto-suggest based on destination (Unsplash API)
  → Or drag & drop custom upload

Section 8: Visibility
  → Toggle: Public (discoverable) / Private (visible only to you)
```

**Submit flow**: Loading spinner → success page with confetti burst → redirect to `/app/trips`

**Convex mutation**: `createTrip` — writes to `trips` table, linked to current user.

### Step 3.3 — Trip Detail Page (`/app/trips/:id`)

Full view with cover image hero, all details, and **"Find Mates for This Trip"** button.

**✅ Phase 3 Done When**: Trip CRUD works end-to-end, all data persisted in Convex.

---

## Phase 4 — Discovery & Matching Engine (Weeks 5–6)

**Goal**: The core product loop — find compatible travel companions with a beautiful swipe/browse UI.

### Step 4.1 — Compatibility Scoring (Convex Query)

```ts
// convex/matching.ts
export const findCandidates = query(async ({ db, auth }, { tripId }) => {
  const myUser = await getCurrentUser(auth, db);
  const myTrip = await db.get(tripId);

  const allTrips = await db
    .query("trips")
    .filter(
      (t) =>
        t.userId !== myUser._id &&
        t.status !== "completed" &&
        t.isPublic === true,
    )
    .collect();

  // Filter out already-liked users
  const myLikes = await db
    .query("likes")
    .withIndex("by_from", (q) => q.eq("fromUserId", myUser._id))
    .collect();
  const likedIds = new Set(myLikes.map((l) => l.toUserId));

  return allTrips
    .filter((trip) => !likedIds.has(trip.userId))
    .map((trip) => {
      let score = 0;

      // 1. Date overlap (0–25 pts)
      const overlapDays = getDateOverlap(
        myTrip.startDate,
        myTrip.endDate,
        trip.startDate,
        trip.endDate,
      );
      score += Math.min(overlapDays * 2.5, 25);

      // 2. Same destination (0–25 pts)
      if (trip.destination === myTrip.destination) score += 25;
      else if (trip.country === myTrip.country) score += 10;

      // 3. Shared travel styles (0–20 pts)
      const sharedStyles = intersect(
        myUser.travelStyles,
        otherUser.travelStyles,
      );
      score += Math.min(sharedStyles.length * 5, 20);

      // 4. Language match (0–15 pts)
      const sharedLangs = intersect(myUser.languages, otherUser.languages);
      score += Math.min(sharedLangs.length * 7, 15);

      // 5. Budget compatibility (0–10 pts)
      if (trip.budget === myTrip.budget) score += 10;
      else if (budgetDiff(trip.budget, myTrip.budget) === 1) score += 5;

      // 6. Shared interest tags (0–5 pts)
      const sharedInterests = intersect(
        myUser.interestTags,
        otherUser.interestTags,
      );
      score += Math.min(sharedInterests.length, 5);

      return { trip, user: otherUser, compatibilityScore: Math.round(score) };
    })
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
});
```

### Step 4.2 — Discover Page (`/app/discover`)

**Toggle between two modes** (top-right toggle button):

#### 🃏 Card Swipe Mode (Default)

- Stack of 3 cards visible — top card is interactive, others peek behind with scale transform
- **Drag mechanics** (Framer Motion):
  - Drag left → red tint overlay + ✕ icon → PASS
  - Drag right → green tint overlay + ♥ icon → LIKE
  - Velocity threshold: throw card off screen if fast enough
  - Keyboard: `←` / `→` arrow keys also work
- **Card content**:
  - Full-height avatar photo
  - Bottom gradient overlay with name, age, city
  - Expandable detail panel: trip info, compatibility %, shared interests chips
  - **Animated arc gauge** showing compatibility % (SVG circle stroke animation)
- **Like action** → Convex mutation `likeUser` → check for mutual like
- **Match detection**: If both users liked each other → trigger Match Overlay

#### Match Overlay (Full-Screen Modal)

- Both avatar photos slide in from left/right and "click" together with a particle burst
- Background: dark with golden sparkle particles
- Text: _"It's a Match! 🎉"_ (gold gradient text, bounce-in animation)
- Subtext: _"You and [Name] both want to explore [Destination]!"_
- Buttons: **Start Chatting** (teal) + **Keep Exploring** (ghost)
- Convex mutation: `createMatch` → writes to `matches` table

#### 📋 List Browse Mode

- Vertical feed of condensed profile cards
- **Filter sidebar** (collapsible on mobile):
  - Destination text search
  - Date range filter
  - Budget filter (checkboxes)
  - Language filter (multi-select)
  - Travel style filter
- **Sort**: Best Match / Newest / Soonest Trip
- Each card: avatar, name, destination, dates, compatibility %, Like button

### Step 4.3 — Real-time Match Notifications

- `useQuery(api.matches.getMyMatches)` — Convex subscription auto-updates
- New match → toast notification + bell badge increment + notification stored in DB

**✅ Phase 4 Done When**: Swipe UI works, scoring algorithm runs, matches are created in Convex on mutual like, match overlay fires.

---

## Phase 5 — Chat & Matches (Weeks 7–8)

**Goal**: Real-time chat built entirely on Convex subscriptions — no third-party chat SDK needed.

### Step 5.1 — Matches Page (`/app/matches`)

**Two-column layout** (desktop: sidebar + chat panel; mobile: full-screen each)

**Left sidebar — Match List**:

- Avatar pair (both users' photos overlapping, like iMessage group icon)
- Match name + shared destination + flag
- Last message preview (truncated to 1 line)
- Timestamp (relative: "just now", "2h ago", "Yesterday")
- Unread message count badge (teal pill)
- Online indicator dot (green)
- Sorted by: most recent message first

**Active match** → teal left border + subtle background glow

### Step 5.2 — Chat Panel (`/app/chat/:matchId`)

**Built on Convex real-time**:

```ts
// convex/messages.ts

export const sendMessage = mutation(async ({ db, auth }, { matchId, text, imageUrl? }) => {
  const user = await getCurrentUser(auth, db);
  await db.insert("messages", {
    matchId, senderId: user._id,
    text, imageUrl,
    isRead: false, createdAt: Date.now()
  });
  // Mark other person's messages as read
  await markAsRead(db, matchId, user._id);
});

export const getMessages = query(async ({ db }, { matchId }) => {
  return db.query("messages")
    .withIndex("by_match", q => q.eq("matchId", matchId))
    .order("asc")
    .collect();
});
```

**Chat UI Features**:

- Message bubbles: **Sent** (teal gradient, right-aligned) / **Received** (glass card, left-aligned)
- Day separator labels: _"Today"_, _"Yesterday"_, _"Feb 25"_
- Timestamps on each message (shown on hover)
- Read receipts: single tick (sent) → double tick (delivered) → teal double tick (read)
- **Typing indicator**: animated 3-dot bounce when other user is typing
- **Emoji reactions**: long-press message → emoji picker appears, reaction shows below bubble
- **Image sharing**: click attachment icon → upload to Convex file storage → renders inline
- **Trip Pin card** at top of chat: _"📍 Traveling to Bali, March 5–15"_ — expandable
- **Export to PDF** (jsPDF): download full chat history
- **Message search**: magnify icon opens search bar, highlights matches
- Input: text field + emoji button + attachment button + send button (teal, arrow icon)
- Press Enter to send, Shift+Enter for new line

### Step 5.3 — Notifications System

**Convex subscription** on `notifications` table for current user:

| Event                   | Toast Message                           |
| ----------------------- | --------------------------------------- |
| New match               | _"🎉 You matched with Aria for Tokyo!"_ |
| New chat message        | _"💬 Aria: Can't wait for Bali!"_       |
| Someone liked your trip | _"❤️ Marco liked your trip to Rome"_    |

- Bell icon in sidebar shows unread count badge
- Notification drawer (slide-out from right): list of all notifications, click to navigate
- Clicking a notification → marks as read + navigates to relevant page

**✅ Phase 5 Done When**: Real-time chat works between two users, notifications fire, matches sidebar shows live data.

---

## Phase 6 — Polish & Production (Weeks 9–10)

### Step 6.1 — Profile Page (`/app/profile`)

**Layout**:

- **Cover banner**: gradient mesh background or user-uploaded cover photo
- **Floating avatar card**: avatar, name, age, traveler type badge, joined date
- **Edit Profile** button (top right)

**Sections**:

1. **WanderMate Card** — Animated card preview (how others see you); shareable
2. **Personal Details** — Inline editable fields (click field → becomes input → save)
3. **Travel Stats** — Animated count-up numbers: Trips posted / Matches made / Countries
4. **My Interests** — Colourful pill badges
5. **My Trips Timeline** — Horizontal scrollable row of trip cards (Planning / Active / Completed tabs)
6. **Settings** (gear icon drawer):
   - Notification preferences toggles
   - Profile visibility (Public / Matches Only / Private)
   - Account deletion (red, confirmation modal)

### Step 6.2 — Edit Profile (`/app/profile/edit`)

Same fields as onboarding wizard but in a single long-scroll form, pre-filled with existing data. Save button sticks to bottom (sticky footer).

### Step 6.3 — Performance Optimizations

- Lazy load all page components with `React.lazy` + `Suspense`
- Image optimization: serve from Convex file storage with size parameters
- Debounce all search/filter inputs
- Virtualize long message lists (react-window or similar)

### Step 6.4 — SEO & Meta Tags

- Add `react-helmet-async`
- Unique title + description per page
- Open Graph tags for profile/trip sharing

### Step 6.5 — Deployment

- **Frontend**: Deploy to [Vercel](https://vercel.com) — connect GitHub, auto-deploys on push
- **Backend**: Convex auto-deploys when you push; run `npx convex deploy` for production
- Set environment variables in Vercel dashboard: `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_CONVEX_URL`

---

## 13. Suggested Feature Improvements

| Feature                           | Description                                                                                                                                                                                         | Priority  |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| **Vibe Check Quiz**               | 5 quick personality questions after onboarding → assigns a traveler archetype shown on profile: _The Adventurer 🧗_, _The Foodie 🍜_, _The Photographer 📷_, _The Socialite 🎉_, _The Historian 📚_ | 🔴 High   |
| **Trip Board**                    | A public feed of all open trips — browse like a bulletin board without swiping. Filter by destination, date, budget. Great for users who aren't in "swipe mode".                                    | 🔴 High   |
| **Compatibility Breakdown**       | On each profile/swipe card, show WHY they're a good match: "You both speak French", "Same travel style", "Overlapping dates" — with coloured tags for each reason                                   | 🔴 High   |
| **Group Trips**                   | Allow 3–5 people to all join the same trip group — multi-person matching                                                                                                                            | 🟠 Medium |
| **AI Trip Suggestions**           | After posting a trip, use an AI endpoint to suggest: best time to visit, packing list essentials, must-see places, hidden gems                                                                      | 🟠 Medium |
| **Verified Badge**                | Email/phone verification → shows ✅ badge on profile for trust/safety                                                                                                                               | 🟠 Medium |
| **Wishlist / Dream Destinations** | Save destinations without a fixed date → used for future matching and notification when others post trips there                                                                                     | 🟠 Medium |
| **Safety Features**               | Report user, block user, profile visibility controls, "Safe word" trip cancellation with no-questions-asked anonymous exit                                                                          | 🟠 Medium |
| **Shareable WanderMate Card**     | Generate a beautiful shareable image card of your profile (canvas API or html2canvas) — share on Instagram/Twitter to attract travel mates                                                          | 🟡 Low    |
| **Destination Reviews**           | After a trip is marked "Completed", prompt user to leave a short review of the destination                                                                                                          | 🟡 Low    |
| **Travel Buddy Rating**           | After a matched trip completes, users can rate each other as travel companions (1–5 stars, private — used to improve match quality)                                                                 | 🟡 Low    |
| **In-App Map**                    | Interactive world map on the profile page showing all visited destinations + wishlist pins                                                                                                          | 🟡 Low    |

---

## 14. Timeline Summary

| Week    | Phase   | Milestone                                                |
| ------- | ------- | -------------------------------------------------------- |
| Week 1  | Phase 1 | Vite + Convex + Clerk wired, design system, shell layout |
| Week 2  | Phase 2 | Landing page complete                                    |
| Week 3  | Phase 2 | Onboarding wizard complete, user created in Convex       |
| Week 4  | Phase 3 | Trip CRUD complete, forms + cards polished               |
| Week 5  | Phase 4 | Matching algorithm in Convex, Discover page (list mode)  |
| Week 6  | Phase 4 | Swipe card UI, Match overlay, mutual like detection      |
| Week 7  | Phase 5 | Real-time chat built on Convex                           |
| Week 8  | Phase 5 | Matches sidebar, notifications, read receipts            |
| Week 9  | Phase 6 | Profile page, edit profile, stats                        |
| Week 10 | Phase 6 | Polish, performance, extra features, production deploy   |

---

## 15. Final Dependency List

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "convex": "latest",
    "@clerk/clerk-react": "latest",
    "framer-motion": "^11.0.0",
    "lucide-react": "latest",
    "sonner": "latest",
    "jspdf": "^3.0.0",
    "date-fns": "latest",
    "clsx": "latest"
  },
  "devDependencies": {
    "vite": "^6.0.0",
    "@vitejs/plugin-react": "latest",
    "eslint": "latest"
  }
}
```

---

---

# 🚀 Plan 2 — After Matching: Trip Collaboration & Post-Match Experience

> **Goal**: Transform WanderMate from a "match and chat" app into a complete trip planning companion. Once two users match, they need tools to **plan together**, **coordinate logistics**, **build trust**, and **close the loop** after the trip ends.

---

## 📌 Plan 2 — Table of Contents

1. [Current State & Gaps](#p2-1-current-state--gaps)
2. [Architecture Overview](#p2-2-architecture-overview)
3. [Phase 7 — Trip Collaboration Hub](#p2-phase-7--trip-collaboration-hub)
4. [Phase 8 — Trust, Safety & Verification](#p2-phase-8--trust-safety--verification)
5. [Phase 9 — Post-Trip Closure](#p2-phase-9--post-trip-closure)
6. [Phase 10 — Enhanced Chat & Communication](#p2-phase-10--enhanced-chat--communication)
7. [Database Schema Additions](#p2-database-schema-additions)
8. [New Routes](#p2-new-routes)
9. [Timeline](#p2-timeline)

---

## P2-1. Current State & Gaps

### What we have today ✅

- Discover → Like → Mutual match creation (automatic)
- 1:1 real-time chat (Convex subscriptions)
- Read receipts, message search, PDF export
- Match list with last message preview, unread badges
- Notifications for likes, matches, and messages
- Trip details visible as a collapsible card in chat

### What's missing after a match ❌

| Gap                          | Impact                                                        |
| ---------------------------- | ------------------------------------------------------------- |
| No shared trip planning      | Users switch to WhatsApp/Google Docs to plan                  |
| No activity coordination     | Can't agree on what to do together                            |
| No expense splitting         | Money conversations happen outside the app                    |
| No meeting point / logistics | No way to coordinate arrival, hotel, meetup spot              |
| No way to block/report users | Safety risk for solo travelers                                |
| No post-trip feedback        | Can't rate travel buddy, no quality signal for future matches |
| No trip status transitions   | Matched trips stay in "planning" forever                      |
| No file/link sharing in chat | Can't share booking confirmations, maps, links                |
| No typing indicators         | Feels dead when waiting for a reply                           |

---

## P2-2. Architecture Overview

All new features use the **existing stack** — no new dependencies unless noted:

```
┌──────────────────────────────────────────────────────┐
│                    React Frontend                     │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ TripHub  │  │ Enhanced │  │   Post-Trip Flow  │  │
│  │  Page    │  │  Chat    │  │   (Rate + Review) │  │
│  └────┬─────┘  └────┬─────┘  └────────┬──────────┘  │
│       │              │                 │              │
├───────┼──────────────┼─────────────────┼──────────────┤
│       ▼              ▼                 ▼              │
│              Convex Backend (Real-time)               │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ tripPlans│  │ messages │  │    ratings         │  │
│  │ activities│  │ (enhanced│  │    reports         │  │
│  │ expenses │  │  + links)│  │    blocks          │  │
│  └──────────┘  └──────────┘  └───────────────────┘  │
└──────────────────────────────────────────────────────┘
```

---

## P2-Phase 7 — Trip Collaboration Hub

> **The centrepiece of Plan 2.** A shared workspace for matched users to plan their trip.

### Step 7.1 — Trip Hub Page (`/app/trips/:id/hub`)

A new page accessible from the match card or chat header. Shows the shared trip with collaborative tools in a tabbed layout.

**Entry Points**:

- "Plan Together" button on the match detail panel
- Trip pin card in chat → "Open Hub" link
- Direct URL from notifications

**Layout**:

```
┌─────────────────────────────────────────────┐
│  ← Back    🏝 Bali Trip Hub    💬 Chat      │
│─────────────────────────────────────────────│
│  [Overview]  [Activities]  [Expenses]  [Notes]│
│─────────────────────────────────────────────│
│                                             │
│           Tab content area                  │
│                                             │
│─────────────────────────────────────────────│
│  Trip Status: Planning → Confirmed → Active │
└─────────────────────────────────────────────┘
```

### Step 7.2 — Overview Tab

Shows a summary of the shared trip:

| Element               | Description                                                                   |
| --------------------- | ----------------------------------------------------------------------------- |
| **Trip Card**         | Destination, country, dates, budget, vibe — pulled from the trip record       |
| **Countdown**         | "23 days until your trip!" with animated number                               |
| **Match Info**        | Both users' avatars, names, compatibility score                               |
| **Trip Status Pill**  | Planning → Confirmed → Active → Completed (clickable to advance)              |
| **Quick Links**       | Jump to Activities, Expenses, Chat                                            |
| **Logistics Section** | Editable fields: arrival date/time, accommodation name/address, meeting point |

**Convex Schema** — `tripPlans` table:

```typescript
tripPlans: defineTable({
  matchId: v.id("matches"),
  tripId: v.id("trips"),
  status: v.string(), // "planning" | "confirmed" | "active" | "completed"
  logistics: v.object({
    meetingPoint: v.optional(v.string()),
    accommodation: v.optional(v.string()),
    arrivalNotes: v.optional(v.string()),
    emergencyContact: v.optional(v.string()),
  }),
  createdAt: v.number(),
  updatedAt: v.number(),
});
```

**Convex Functions**:

- `tripPlans.getByMatch({ matchId })` — query
- `tripPlans.createOrUpdate({ matchId, tripId, ... })` — mutation
- `tripPlans.updateStatus({ planId, status })` — mutation (both users can advance)
- `tripPlans.updateLogistics({ planId, logistics })` — mutation

### Step 7.3 — Activities Tab

A shared checklist of things to do on the trip. Either user can add, vote, or check off items.

**UI**:

```
┌─────────────────────────────────────────────┐
│  + Add Activity                             │
│─────────────────────────────────────────────│
│  ☐  Visit Ubud Monkey Forest     👍 2/2    │
│  ☐  Sunrise hike at Mt. Batur    👍 1/2    │
│  ☑  Book surf lesson             👍 2/2    │
│  ☐  Night market food tour       👍 1/2    │
└─────────────────────────────────────────────┘
```

Each activity:

- Title (required), optional notes, optional link (booking URL)
- Vote system: both users can 👍 to confirm interest (shows "2/2" or "1/2")
- Checkbox: mark as done during the trip
- Added-by indicator (avatar of who suggested it)
- Drag to reorder (optional — stretch goal)

**Convex Schema** — `activities` table:

```typescript
activities: defineTable({
  tripPlanId: v.id("tripPlans"),
  title: v.string(),
  notes: v.optional(v.string()),
  link: v.optional(v.string()),
  addedBy: v.id("users"),
  votes: v.array(v.id("users")), // users who upvoted
  isDone: v.boolean(),
  order: v.number(),
  createdAt: v.number(),
}).index("by_tripPlan", ["tripPlanId"]);
```

**Convex Functions**:

- `activities.list({ tripPlanId })` — query, sorted by order
- `activities.add({ tripPlanId, title, notes?, link? })` — mutation
- `activities.toggleVote({ activityId })` — mutation (add/remove current user)
- `activities.toggleDone({ activityId })` — mutation
- `activities.remove({ activityId })` — mutation (only creator or either match user)

### Step 7.4 — Expenses Tab

A simple shared expense tracker. Not a full accounting system — just enough to keep things fair.

**UI**:

```
┌─────────────────────────────────────────────┐
│  + Add Expense              Balance: You owe │
│                             Sarah $12.50     │
│─────────────────────────────────────────────│
│  🏨 Hostel (2 nights)    $40    Paid: You   │
│  🍜 Dinner at Warung     $15    Paid: Sarah │
│  🏄 Surf lesson          $30    Paid: Split │
│─────────────────────────────────────────────│
│  Total: $85  │  You: $47.50  │  Sarah: $37.50│
└─────────────────────────────────────────────┘
```

Each expense:

- Description, amount (number), who paid ("me", "them", or "split")
- Category emoji picker (optional: 🏨 🍜 🚕 🎫 🏄 🛒)
- Date (defaults to today)

Balance calculation: simple running total of who owes whom.

**Convex Schema** — `expenses` table:

```typescript
expenses: defineTable({
  tripPlanId: v.id("tripPlans"),
  description: v.string(),
  amount: v.number(),
  currency: v.string(), // default "USD"
  paidBy: v.id("users"),
  splitType: v.string(), // "equal" | "payer_only"
  category: v.optional(v.string()),
  date: v.string(),
  createdAt: v.number(),
}).index("by_tripPlan", ["tripPlanId"]);
```

**Convex Functions**:

- `expenses.list({ tripPlanId })` — query
- `expenses.add({ tripPlanId, description, amount, paidBy, splitType })` — mutation
- `expenses.remove({ expenseId })` — mutation
- `expenses.getBalance({ tripPlanId })` — query (returns { userA: total, userB: total, owes: ... })

### Step 7.5 — Notes Tab

A simple shared notepad — both users can edit. Perfect for packing lists, flight details, useful phrases in the local language, etc.

**Implementation**: Single text area per trip plan, saved on blur or after 2s debounce. Shows "Last edited by Sarah, 3h ago" indicator. Use Convex's real-time subscription to show live updates.

**Convex Schema** — add field to `tripPlans`:

```typescript
// Add to tripPlans table:
sharedNotes: v.optional(v.string()),
notesUpdatedBy: v.optional(v.id("users")),
notesUpdatedAt: v.optional(v.number()),
```

---

## P2-Phase 8 — Trust, Safety & Verification

> **Critical for a travel companion app.** Users need to feel safe meeting strangers.

### Step 8.1 — Block & Report System

**Block User**:

- Available from: match detail panel, chat header (⋮ menu), user profile
- Blocks both directions: removes match, hides from discover, stops notifications
- Blocked users can't see your trips or profile
- Reversible from Settings

**Report User**:

- Triggered from same locations as block
- Modal with reason picker: "Inappropriate messages", "Fake profile", "Spam", "Scam/fraud", "Made me feel unsafe", "Other"
- Optional text description
- Auto-blocks after report

**Convex Schema**:

```typescript
blocks: defineTable({
  blockerId: v.id("users"),
  blockedId: v.id("users"),
  createdAt: v.number(),
})
  .index("by_blocker", ["blockerId"])
  .index("by_blocked", ["blockedId"]);

reports: defineTable({
  reporterId: v.id("users"),
  reportedId: v.id("users"),
  reason: v.string(),
  description: v.optional(v.string()),
  status: v.string(), // "pending" | "reviewed" | "actioned"
  createdAt: v.number(),
}).index("by_reported", ["reportedId"]);
```

**Impact on existing queries**:

- `discover.getCandidates` → filter out blocked users (both directions)
- `matches.getMyMatches` → filter out blocked users
- `likes.likeUser` → reject if blocked

### Step 8.2 — Verified Badge

A visual ✅ badge on profiles for users who verify their identity.

**Verification methods** (progressive):

1. **Email verified** — automatic via Clerk (already done) → shows small check
2. **Phone verified** — add phone to Clerk profile → shows ✅ badge
3. **Photo verified** — stretch goal: selfie match with profile photo

**Convex Schema** — add to `users` table:

```typescript
// Add to users:
verificationLevel: v.optional(v.number()), // 0=none, 1=email, 2=phone, 3=photo
```

Show on: profile page, discover cards, match cards, chat header.

### Step 8.3 — Safety Tips

A non-intrusive safety reminder shown at key moments:

- **First match**: Toast or modal — "Meeting someone new? Here are some safety tips..."
- **Chat start**: Subtle banner — "Never share financial information or travel alone without telling someone"
- **Trip confirmed**: Checklist reminder — "Share your itinerary with a trusted friend"

Implementation: static content, shown once per trigger (use localStorage flag).

---

## P2-Phase 9 — Post-Trip Closure

> **Close the loop.** After the trip, prompt users to rate, review, and mark complete.

### Step 9.1 — Trip Completion Flow

When a trip's end date passes or either user marks it "completed":

1. **Completion Prompt** — Notification + banner on matches page: "How was your trip to Bali with Sarah?"
2. **Rate Your Buddy** — 1–5 star rating + optional short review (max 200 chars)
3. **Trip Highlights** — Optional: user can add 1–3 highlight moments (text only, no photos for MVP)
4. **Thank You Screen** — "Thanks for rating! Your feedback improves future matches."

**UI Flow**:

```
[Notification: "Your Bali trip ended! Rate your experience"]
     ↓
[Rate screen: ⭐⭐⭐⭐⭐ + text box]
     ↓
[Optional highlights: "Best moment?", "Would travel again?"]
     ↓
[Thank you + back to matches]
```

**Convex Schema** — `ratings` table:

```typescript
ratings: defineTable({
  matchId: v.id("matches"),
  raterId: v.id("users"),
  ratedId: v.id("users"),
  score: v.number(), // 1–5
  review: v.optional(v.string()),
  highlights: v.optional(v.array(v.string())),
  createdAt: v.number(),
})
  .index("by_match", ["matchId"])
  .index("by_rated", ["ratedId"]);
```

**Rules**:

- Each user rates the other once per match (enforced via unique check on matchId + raterId)
- Ratings are **private** — the rated user sees their average score on their profile, not individual reviews
- Average rating shown on profile after ≥ 2 ratings (to prevent single-rating bias)

### Step 9.2 — Travel Score

A gamified aggregate displayed on the user's profile:

```
🏆 Travel Score: 4.6 / 5.0
   Based on 7 trip companions
```

- Calculated as weighted average of all ratings received
- Visible on profile page and discover cards (if ≥ 2 ratings)
- Factors into compatibility score (small bonus for highly-rated users)

**Convex Function**:

- `ratings.getAverageForUser({ userId })` — query → { average, count }

### Step 9.3 — Trip Archive

Completed trips move to an "Archive" section on the Trips page:

- Separate tab: **Active** | **Completed**
- Completed trips show: destination, dates, travel buddy name + avatar, your rating
- Tapping a completed trip shows a read-only Trip Hub with all activities/expenses preserved

---

## P2-Phase 10 — Enhanced Chat & Communication

> **Make chat feel alive** with small but impactful improvements.

### Step 10.1 — Typing Indicator

Show "Sarah is typing..." when the other user is composing a message.

**Implementation**:

- Convex table: `typingIndicators` (matchId, userId, isTyping, updatedAt)
- Client sends `setTyping(true)` on keydown (debounced), `setTyping(false)` on 3s idle or send
- Subscription shows animated dots below last message
- Auto-expire: ignore indicators older than 5s (stale data protection)

```typescript
typingIndicators: defineTable({
  matchId: v.id("matches"),
  userId: v.id("users"),
  isTyping: v.boolean(),
  updatedAt: v.number(),
}).index("by_match", ["matchId"]);
```

### Step 10.2 — Link Previews in Chat

When a user sends a message containing a URL:

- Detect URLs via regex in the message text
- Render the URL as a clickable card below the message bubble
- For MVP: just show the URL as a styled link with domain name + external icon
- Stretch: fetch Open Graph metadata (title, description, image) via Convex action

### Step 10.3 — Message Reactions

Quick emoji reactions on messages (no new table — store inline):

```typescript
// Add to messages table:
reactions: v.optional(
  v.array(
    v.object({
      emoji: v.string(),
      userId: v.id("users"),
    }),
  ),
);
```

- Tap/long-press a message → show emoji picker (6 quick emojis: 👍 ❤️ 😂 😮 😢 🔥)
- Reactions render as small pills below the message bubble
- Toggle on/off (tap same emoji to remove)

### Step 10.4 — Image Sharing in Chat

The `imageUrl` field already exists in the messages schema but isn't used yet.

**Implementation**:

- Add a 📎 button next to the send button
- Upload image to Convex file storage (`ctx.storage.store()`)
- Send message with `imageUrl` pointing to the stored file
- Render images inline in chat bubbles (click to expand lightbox)
- Max file size: 5 MB, formats: jpg/png/webp

---

## P2-Database Schema Additions — Summary

```typescript
// New tables to add to schema.ts

tripPlans: defineTable({
  matchId: v.id("matches"),
  tripId: v.id("trips"),
  status: v.string(),
  logistics: v.object({
    meetingPoint: v.optional(v.string()),
    accommodation: v.optional(v.string()),
    arrivalNotes: v.optional(v.string()),
    emergencyContact: v.optional(v.string()),
  }),
  sharedNotes: v.optional(v.string()),
  notesUpdatedBy: v.optional(v.id("users")),
  notesUpdatedAt: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_match", ["matchId"])
  .index("by_trip", ["tripId"]),

activities: defineTable({
  tripPlanId: v.id("tripPlans"),
  title: v.string(),
  notes: v.optional(v.string()),
  link: v.optional(v.string()),
  addedBy: v.id("users"),
  votes: v.array(v.id("users")),
  isDone: v.boolean(),
  order: v.number(),
  createdAt: v.number(),
}).index("by_tripPlan", ["tripPlanId"]),

expenses: defineTable({
  tripPlanId: v.id("tripPlans"),
  description: v.string(),
  amount: v.number(),
  currency: v.string(),
  paidBy: v.id("users"),
  splitType: v.string(),
  category: v.optional(v.string()),
  date: v.string(),
  createdAt: v.number(),
}).index("by_tripPlan", ["tripPlanId"]),

ratings: defineTable({
  matchId: v.id("matches"),
  raterId: v.id("users"),
  ratedId: v.id("users"),
  score: v.number(),
  review: v.optional(v.string()),
  highlights: v.optional(v.array(v.string())),
  createdAt: v.number(),
})
  .index("by_match", ["matchId"])
  .index("by_rated", ["ratedId"]),

blocks: defineTable({
  blockerId: v.id("users"),
  blockedId: v.id("users"),
  createdAt: v.number(),
})
  .index("by_blocker", ["blockerId"])
  .index("by_blocked", ["blockedId"]),

reports: defineTable({
  reporterId: v.id("users"),
  reportedId: v.id("users"),
  reason: v.string(),
  description: v.optional(v.string()),
  status: v.string(),
  createdAt: v.number(),
}).index("by_reported", ["reportedId"]),

typingIndicators: defineTable({
  matchId: v.id("matches"),
  userId: v.id("users"),
  isTyping: v.boolean(),
  updatedAt: v.number(),
}).index("by_match", ["matchId"]),
```

**Modifications to existing tables**:

```typescript
// users: add
verificationLevel: v.optional(v.number()),

// messages: add
reactions: v.optional(v.array(v.object({
  emoji: v.string(),
  userId: v.id("users"),
})))
```

---

## P2-New Routes

| Route                     | Page      | Description                                                            |
| ------------------------- | --------- | ---------------------------------------------------------------------- |
| `/app/trips/:id/hub`      | TripHub   | Shared collaboration workspace (overview, activities, expenses, notes) |
| `/app/trips/:id/hub/rate` | RateBuddy | Post-trip rating flow                                                  |

---

## P2-Timeline

| Phase        | Scope                  | Key Deliverables                                                                                   |
| ------------ | ---------------------- | -------------------------------------------------------------------------------------------------- |
| **Phase 7**  | Trip Collaboration Hub | TripHub page with 4 tabs (overview, activities, expenses, notes), trip plan CRUD, shared logistics |
| **Phase 8**  | Trust & Safety         | Block/report system, filter blocked users from all queries, verified badge, safety tips            |
| **Phase 9**  | Post-Trip Closure      | Trip completion prompt, buddy rating, travel score on profile, trip archive                        |
| **Phase 10** | Enhanced Chat          | Typing indicators, link previews, message reactions, image sharing                                 |

### Recommended Build Order

```
Phase 7   ██████████████████░░░░░░   (largest — build first, highest user value)
Phase 10  ████████░░░░░░░░░░░░░░░░   (chat enhancements — quick wins, high polish)
Phase 8   ██████████░░░░░░░░░░░░░░   (safety — important but less complex)
Phase 9   ████████░░░░░░░░░░░░░░░░   (post-trip — only relevant after real usage)
```

Start with **Phase 7** — it directly solves the #1 gap (users leaving the app to plan) and touches the most new code.

---

_"The world is better with a mate — especially when you plan the adventure together."_ 🌍
