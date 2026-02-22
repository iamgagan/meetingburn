# 🔥 MeetingBurn

**See what your meetings really cost — in real-time.**

[![Live Demo](https://img.shields.io/badge/Live-meetingburn--tau.vercel.app-emerald?style=for-the-badge)](https://meetingburn-tau.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-iamgagan%2Fmeetingburn-black?style=for-the-badge&logo=github)](https://github.com/iamgagan/meetingburn)

> Built for the **48-Hour Vibe Coding Challenge** by **Team KashMoney**

🌐 **Live Demo:** [https://meetingburn-tau.vercel.app](https://meetingburn-tau.vercel.app)

---

## What is MeetingBurn?

A real-time meeting cost calculator that shows teams the true dollar cost of their meetings — live, as they happen. Enter the number of attendees and their average salary, start the timer, and watch the money tick up every second.

![Landing Page](./landing_page_KashMoney.png)

## Features

- 🔥 **Real-time Cost Ticker** — Live-updating dollar counter with severity-based color coding (green → yellow → red)
- 📅 **Google Calendar Sync** — Auto-import meetings with attendee counts for effortless tracking
- 📊 **Meeting History & Analytics** — Weekly cost trends, sortable tables, and CSV export
- 🔗 **Shareable Reports** — Public links showing meeting cost breakdowns
- 👥 **Salary Presets** — Role-based salaries (Engineer, PM, Designer) for accurate calculations
- 🔐 **Google OAuth** — Sign in with Google using NextAuth.js

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | TailwindCSS v4 + Shadcn/ui |
| Animations | Framer Motion |
| Charts | Recharts |
| Database | Supabase (PostgreSQL) |
| Auth | NextAuth.js (Google OAuth) |
| Hosting | Vercel |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/iamgagan/meetingburn.git
cd meetingburn

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase and Google OAuth credentials

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see MeetingBurn in action.

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXTAUTH_URL` | App URL (http://localhost:3000 for dev) |
| `NEXTAUTH_SECRET` | Random secret for NextAuth.js |

## Route Structure

```
/                          → Landing page with live demo
/signin                    → Google OAuth sign-in
/dashboard                 → Main dashboard with cost tracker
/dashboard/calendar        → Google Calendar sync
/dashboard/history         → Meeting history & analytics
/dashboard/settings        → Salary presets management
/report/[id]               → Shareable meeting report
/api/auth/[...nextauth]    → Auth endpoints
/api/calendar              → Calendar API
/api/meetings              → Meetings CRUD API
```

## Team

**Gagandeep Singh** — [gagan.2492@gmail.com](mailto:gagan.2492@gmail.com)

---

*Built with ❤️ and too many meetings by Team KashMoney*
