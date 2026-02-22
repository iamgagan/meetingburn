import { NextRequest, NextResponse } from 'next/server';

// GET /api/meetings — List meetings (from localStorage on client)
// This API route is a placeholder for Supabase integration
// For now, meetings are stored in localStorage

export async function GET() {
    return NextResponse.json({
        message: 'Meetings API ready. Connect Supabase for persistent storage.',
        meetings: [],
    });
}

// POST /api/meetings — Save a meeting
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { meeting_name, attendees, avg_salary, duration_seconds, total_cost, source } = body;

        if (!attendees || !avg_salary || !duration_seconds) {
            return NextResponse.json(
                { error: 'Missing required fields: attendees, avg_salary, duration_seconds' },
                { status: 400 }
            );
        }

        // Placeholder: In production, save to Supabase
        const meeting = {
            id: crypto.randomUUID(),
            meeting_name: meeting_name || 'Untitled Meeting',
            attendees,
            avg_salary,
            duration_seconds,
            total_cost: total_cost || 0,
            source: source || 'manual',
            created_at: new Date().toISOString(),
        };

        return NextResponse.json({ meeting }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
}
