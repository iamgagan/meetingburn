import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/calendar — Fetch Google Calendar events
export async function GET() {
    const session = await getServerSession(authOptions);
    const accessToken = (session as any)?.accessToken;

    if (!accessToken) {
        return NextResponse.json({
            demo: true,
            message: 'No access token found. Using demo data.',
            events: getDemoMeetings(),
        });
    }

    try {
        const response = await fetch(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events?' +
            new URLSearchParams({
                timeMin: new Date().toISOString(),
                timeMax: new Date(Date.now() + 7 * 86400000).toISOString(), // Look ahead 7 days
                singleEvents: 'true',
                orderBy: 'startTime',
            }),
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch from Google Calendar');
        }

        const data = await response.json();

        // Map Google Calendar events to our internal meeting format
        const events = (data.items || []).map((item: any) => ({
            id: item.id,
            summary: item.summary || 'Untitled Meeting',
            start: item.start?.dateTime || item.start?.date,
            end: item.end?.dateTime || item.end?.date,
            attendeeCount: (item.attendees?.length || 0) + 1, // +1 for the organizer
        }));

        return NextResponse.json({
            demo: false,
            events,
        });
    } catch (error: any) {
        console.error('Calendar API Error:', error);
        return NextResponse.json({
            demo: true,
            error: error.message,
            events: getDemoMeetings(),
        });
    }
}

function getDemoMeetings() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);

    return [
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
}
