import { NextResponse } from 'next/server';

// GET /api/calendar — Fetch Google Calendar events
// In production, this uses NextAuth session to get the user's Google access token

export async function GET() {
    // TODO: When Google OAuth is configured, uncomment this block:
    //
    // const session = await getServerSession(authOptions);
    // const accessToken = (session as any)?.accessToken;
    //
    // if (accessToken) {
    //   const response = await fetch(
    //     'https://www.googleapis.com/calendar/v3/calendars/primary/events?' +
    //       new URLSearchParams({
    //         timeMin: new Date().toISOString(),
    //         timeMax: new Date(Date.now() + 86400000).toISOString(),
    //         singleEvents: 'true',
    //         orderBy: 'startTime',
    //       }),
    //     {
    //       headers: { Authorization: `Bearer ${accessToken}` },
    //     }
    //   );
    //   const data = await response.json();
    //   // Map Google Calendar events to our format
    // }

    // Demo data — randomized times based on current time to look realistic
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);

    const demoMeetings = [
        {
            id: `cal-${now.toISOString().split('T')[0]}-1`,
            summary: 'Daily Standup',
            start: new Date(todayStart.getTime()).toISOString(),
            end: new Date(todayStart.getTime() + 15 * 60000).toISOString(),
            attendeeCount: 6,
        },
        {
            id: `cal-${now.toISOString().split('T')[0]}-2`,
            summary: 'Sprint Planning',
            start: new Date(todayStart.getTime() + 60 * 60000).toISOString(),
            end: new Date(todayStart.getTime() + 120 * 60000).toISOString(),
            attendeeCount: 10,
        },
        {
            id: `cal-${now.toISOString().split('T')[0]}-3`,
            summary: 'Design Review',
            start: new Date(todayStart.getTime() + 180 * 60000).toISOString(),
            end: new Date(todayStart.getTime() + 210 * 60000).toISOString(),
            attendeeCount: 4,
        },
        {
            id: `cal-${now.toISOString().split('T')[0]}-4`,
            summary: '1:1 with Manager',
            start: new Date(todayStart.getTime() + 240 * 60000).toISOString(),
            end: new Date(todayStart.getTime() + 270 * 60000).toISOString(),
            attendeeCount: 2,
        },
        {
            id: `cal-${now.toISOString().split('T')[0]}-5`,
            summary: 'All-Hands Update',
            start: new Date(todayStart.getTime() + 300 * 60000).toISOString(),
            end: new Date(todayStart.getTime() + 360 * 60000).toISOString(),
            attendeeCount: 25,
        },
    ];

    return NextResponse.json({
        demo: true,
        events: demoMeetings,
    });
}
