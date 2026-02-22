import { NextResponse } from 'next/server';

// GET /api/calendar — Fetch Google Calendar events
// This route requires a valid Google OAuth token with calendar.readonly scope

export async function GET() {
    // Placeholder: In production, use NextAuth session to get the user's
    // Google access token and fetch from Google Calendar API
    //
    // const session = await getServerSession(authOptions);
    // const accessToken = session?.accessToken;
    //
    // const response = await fetch(
    //   'https://www.googleapis.com/calendar/v3/calendars/primary/events?' +
    //     new URLSearchParams({
    //       timeMin: new Date().toISOString(),
    //       timeMax: new Date(Date.now() + 86400000).toISOString(),
    //       singleEvents: 'true',
    //       orderBy: 'startTime',
    //     }),
    //   {
    //     headers: { Authorization: `Bearer ${accessToken}` },
    //   }
    // );

    return NextResponse.json({
        message:
            'Calendar API ready. Configure Google OAuth to enable calendar sync.',
        events: [
            // Demo data for UI development
            {
                id: 'demo-1',
                summary: 'Daily Standup',
                start: new Date().toISOString(),
                end: new Date(Date.now() + 900000).toISOString(), // 15 min
                attendeeCount: 6,
            },
            {
                id: 'demo-2',
                summary: 'Sprint Planning',
                start: new Date(Date.now() + 3600000).toISOString(),
                end: new Date(Date.now() + 7200000).toISOString(), // 1 hr
                attendeeCount: 10,
            },
            {
                id: 'demo-3',
                summary: 'Design Review',
                start: new Date(Date.now() + 10800000).toISOString(),
                end: new Date(Date.now() + 12600000).toISOString(), // 30 min
                attendeeCount: 4,
            },
        ],
    });
}
