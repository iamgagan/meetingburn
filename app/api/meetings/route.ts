import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { rateLimit } from '@/lib/rate-limit';

const meetingSchema = z.object({
    meeting_name: z.string().optional(),
    attendees: z.number().int().positive(),
    avg_salary: z.number().positive(),
    duration_seconds: z.number().nonnegative(),
    total_cost: z.number().nonnegative().optional(),
    source: z.string().optional(),
    calendar_event_id: z.string().optional()
});

// GET /api/meetings — List meetings for authenticated user
export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json(
            { error: 'Authentication required. Sign in to view your meetings.' },
            { status: 401 }
        );
    }

    const userId = (session.user as Record<string, unknown>).id as string;

    // Use admin client to bypass RLS and filter by userId manually
    const { data, error } = await supabaseAdmin
        .from('meetings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (!error && data) {
        // Normalize any returned string numbers to floats for the UI
        const normalizedData = data.map((meeting: any) => ({
            ...meeting,
            avg_salary: typeof meeting.avg_salary === 'string' ? parseFloat(meeting.avg_salary) : meeting.avg_salary,
            total_cost: typeof meeting.total_cost === 'string' ? parseFloat(meeting.total_cost) : meeting.total_cost,
        }));
        return NextResponse.json({ meetings: normalizedData });
    }

    return NextResponse.json(
        { error: error?.message || 'Failed to fetch meetings' },
        { status: 500 }
    );
}

// POST /api/meetings — Save a meeting
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        // Return 401 early so client can gracefully fall back to localStorage
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;

    if (!rateLimit(request, 10, 60000, userId)) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    try {
        const body = await request.json();

        const validation = meetingSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.format() },
                { status: 400 }
            );
        }

        const { meeting_name, attendees, avg_salary, duration_seconds, total_cost, source, calendar_event_id } = validation.data;
        const user_id = (session.user as Record<string, unknown>).id as string;

        // Deduplication for calendar events
        if (calendar_event_id) {
            const { data: existingEvent } = await supabaseAdmin
                .from('meetings')
                .select('*')
                .eq('user_id', user_id)
                .eq('calendar_event_id', calendar_event_id)
                .single();

            if (existingEvent) {
                return NextResponse.json({ meeting: existingEvent, deduplicated: true }, { status: 200 });
            }
        }

        // Generate a random, short URL-safe string for the public report (e.g., 8 chars)
        const public_slug = Math.random().toString(36).substring(2, 10);

        const meeting = {
            id: crypto.randomUUID(),
            user_id: (session.user as Record<string, unknown>).id,
            meeting_name: meeting_name || 'Untitled Meeting',
            attendees,
            avg_salary,
            duration_seconds,
            total_cost: total_cost || 0,
            source: source || 'manual',
            calendar_event_id: calendar_event_id || null,
            is_public: false,
            public_slug,
            created_at: new Date().toISOString(),
        };

        // Use admin client to save meeting
        // (Ownership is established by the user_id field)
        const { data, error } = await supabaseAdmin
            .from('meetings')
            .insert(meeting)
            .select()
            .single();

        if (!error && data) {
            return NextResponse.json({ meeting: data }, { status: 201 });
        }

        return NextResponse.json(
            { error: error?.message || 'Failed to save meeting' },
            { status: 500 }
        );
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
}
