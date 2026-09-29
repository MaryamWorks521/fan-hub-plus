# Fan Hub Plus - Modern Full-Stack Fandom Universe Portal

Fan Hub Plus is a comprehensive, production-grade full-stack web application designed for fans to discover and explore **Anime, Gaming, Movies, TV Shows, K-Pop, Comics, Manga, and Cosplay** content in one unified, visually cinematic application.

Built strictly according to the **Fan Hub Plus Software Requirements Specification (SRS)**.

---

## 🌟 Key Features

1. **Cinematic Fandom Aesthetic**: Deep dark canvas, custom typography (`Syne` display & `Plus Jakarta Sans` body), zero-pill metadata discipline, and high-fidelity fandom artwork.
2. **8 Dedicated Fandom Pillars**: Deep category portals for Anime, Gaming, Movies, TV Shows, K-Pop, Comics, Manga, and Cosplay with filtered rosters, articles, and releases.
3. **Dynamic Content Explorer**: Unified search and multi-facet filtering (Category, Genre, Release Year, Popularity, Content Type) and sorting (Latest, Most Popular, Alphabetical).
4. **User Authentication & Role-Based Access Control**:
   - **Visitor**: Browse public content, view categories, global search.
   - **Registered User**: Custom profiles, favorite fandoms, bookmarks with personal notes, personalized dashboard, fan content submissions, and AI assistant interaction.
   - **Administrator**: Dedicated management console for users, categories, characters, articles, merchandise, events, fan submission approval queue, feedback tickets, and analytics.
5. **Personalized Dashboard & Notes System**: Private bookmark notes, personalized recommendations, and activity logs.
6. **Conventions & Events Calendar**: Filter by city and category with venue location previews.
7. **Merchandise Showcase (Discovery Only)**: Strictly an exhibition and valuation showcase per SRS—no e-commerce checkout or payments.
8. **Live Countdown Timers**: Real-time ticker for major 2026 releases (GTA VI, Chainsaw Man Reze, Avengers Doomsday).
9. **Fan Content Submission Workflow**: Registered user submissions enter an Admin approval queue (Pending, Approved, Rejected).
10. **Feedback System**: Bug reports, suggestions, and platform queries with tracking.
11. **FanBot AI Assistant**: Grounded in live database facts with `@google/genai` server-side proxy and semantic fallback.
12. **Full Platform Sitemap**: Hierarchical tree matching SRS Section 27.
13. **Accessibility**: Dark/Light mode toggle, Font-size scaler (`A-`, `A`, `A+`), WCAG-compliant contrast.

---

## 🔑 Demo Academic Credentials

For quick evaluation during project review, use the **1-Click Fill Demo Account** buttons inside the Login dialog, or enter manually:

* **Administrator Account**:
  - **Email**: `admin@fanhubplus.com`
  - **Password**: `Admin123!`
  - **Permissions**: Full platform control & analytics.
* **Registered Fan Account**:
  - **Email**: `alex@fanhubplus.com`
  - **Password**: `Fan123!`
  - **Permissions**: Bookmarks, personal notes, submissions, profile.

---

## 🛠 Technology Stack

* **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion.
* **Backend**: Node.js, Express.js REST APIs mounted in `server.ts`.
* **Database Layer**: MongoDB-compatible persistent document store (`data/fanhub_db.json`) supporting standard queries, indexing, and automatic re-seeding. Supports external MongoDB clusters via `MONGODB_URI`.
* **AI Integration**: `@google/genai` TypeScript SDK with server-side proxy route `/api/chatbot/ask`.

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Run full-stack development server (Express backend + Vite middleware on Port 3000)
npm run dev

# 3. Build for production
npm run build
npm start
```
