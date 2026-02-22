# MeetingBurn — Explainer

**Team:** KashMoney  
**Hackathon:** 48-Hour Vibe Coding Challenge

**Team Members:**
- Gagandeep Singh — gagan.2492@gmail.com

**Live Deployment:** https://meetingburn-tau.vercel.app  
**GitHub Repository:** https://github.com/iamgagan/meetingburn


## What is MeetingBurn?

MeetingBurn is a real-time meeting cost calculator that shows teams the true dollar cost of their meetings — live, as they happen. Enter the number of attendees and their average salary, start the timer, and watch the money tick up every second.

## Problem

The average knowledge worker spends **31 hours per week** in meetings. For a team of 5 developers with a $120k average salary, that's over **$37,000/year** in meeting costs — and nobody tracks it. Managers don't realize a 1-hour meeting with 10 people can cost $577+ because there's no visibility into the real cost.

## Solution

MeetingBurn makes the invisible visible:

- **Real-time Cost Ticker** — A live-updating dollar counter that changes color from green → yellow → red as costs escalate.
- **Google Calendar Sync** — Auto-import meetings with attendee counts for effortless tracking.
- **Meeting History & Analytics** — Weekly cost trends, sortable tables, and CSV export.
- **Shareable Reports** — Public links showing meeting cost breakdowns to share with leadership.
- **Salary Presets** — Role-based salaries (Engineer, PM, Designer) for accurate calculations.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript |
| Styling | TailwindCSS v4 + Shadcn/ui |
| Animations | Framer Motion |
| Charts | Recharts |
| Database | Supabase (PostgreSQL) |
| Auth | NextAuth.js (Google OAuth) |
| Hosting | Vercel |

## Key Design Decisions

1. **Dark mode with emerald accents** — Inspired by premium Framer SaaS templates (Nexus, Saatify). The "money green" emerald palette reinforces the cost/financial theme.

2. **The "oh wow" moment** — The CostTicker component uses 60fps animation with severity-based color changes. When costs hit $100+, the numbers glow red. This creates immediate emotional impact.

3. **Zero-friction onboarding** — The landing page has a working calculator with no sign-up required. Users can try the product in 3 seconds.

4. **Supabase + localStorage hybrid** — Meetings persist to Supabase when authenticated, with localStorage fallback for anonymous users.

## Monetization

| Tier | Price | Key Features |
|---|---|---|
| Free | $0 | Manual calculator, 5 meetings/month |
| Pro | $9/mo | Calendar sync, unlimited history, analytics |
| Team | $29/mo | Multi-user, Slack integration, weekly reports |

## What We'd Build Next

1. Slack bot: `/burn` command to show live meeting cost in channels
2. AI meeting summarizer to pair cost data with action items
3. "Meeting budget" alerts when teams exceed weekly cost thresholds
4. Browser extension for Zoom/Meet/Teams integration

---

*Built with ❤️ and too many meetings by Team KashMoney*
