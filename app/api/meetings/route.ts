import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

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

    if (supabaseUrl) {
        const { data, error } = await supabase
            .from('meetings')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (!error && data) {
            return NextResponse.json({ meetings: data });
        }

        return NextResponse.json(
            { error: error?.message || 'Failed to fetch meetings' },
            { status: 500 }
        );
    }

    return NextResponse.json({ meetings: [] });
}

// POST /api/meetings — Save a meeting
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    try {
        const body = await request.json();
        const { meeting_name, attendees, avg_salary, duration_seconds, total_cost, source } = body;

        if (!attendees || !avg_salary || !duration_seconds) {
            return NextResponse.json(
                { error: 'Missing required fields: attendees, avg_salary, duration_seconds' },
                { status: 400 }
            );
        }

        const meeting = {
            id: crypto.randomUUID(),
            user_id: session?.user ? (session.user as Record<string, unknown>).id : 'anonymous',
            meeting_name: meeting_name || 'Untitled Meeting',
            attendees,
            avg_salary,
            duration_seconds,
            total_cost: total_cost || 0,
            source: source || 'manual',
            is_public: true,
            created_at: new Date().toISOString(),
        };

        if (supabaseUrl && session?.user) {
            const { data, error } = await supabase
                .from('meetings')
                .insert(meeting)
                .select()
                .single();

            if (!error && data) {
                return NextResponse.json({ meeting: data }, { status: 201 });
            }
        }

        return NextResponse.json({ meeting }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
}
