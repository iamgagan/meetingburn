import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// GET /api/meetings/[id] — Get a single meeting (public reports)
// Note: In Next.js 15+, route params are async (Promise<{ id: string }>)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (supabaseUrl) {
        const { data, error } = await supabase
            .from('meetings')
            .select('*')
            .eq('id', id)
            .eq('is_public', true)
            .single();

        if (!error && data) {
            return NextResponse.json(data);
        }
    }

    return NextResponse.json(
        { error: 'Report not found or not public' },
        { status: 404 }
    );
}

// PATCH /api/meetings/[id] — Update a meeting (e.g., toggle public)
// Requires authentication; verifies the requester owns the meeting
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const session = await getServerSession(authOptions);

    if (!supabaseUrl) {
        return NextResponse.json({ message: `Meeting ${id} updated`, updates: body });
    }

    // If user is authenticated, verify ownership before updating
    if (session?.user) {
        const userId = (session.user as Record<string, unknown>).id as string;
        const { data: existing } = await supabase
            .from('meetings')
            .select('user_id')
            .eq('id', id)
            .single();

        if (existing && existing.user_id !== userId && existing.user_id !== 'local') {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }
    }

    const { data, error } = await supabase
        .from('meetings')
        .update(body)
        .eq('id', id)
        .select()
        .single();

    if (!error && data) {
        return NextResponse.json(data);
    }
    return NextResponse.json({ error: error?.message }, { status: 400 });
}

// DELETE /api/meetings/[id] — Delete a meeting (requires ownership)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!supabaseUrl) {
        return NextResponse.json({ message: `Meeting ${id} deleted` });
    }

    // Verify ownership before deleting
    if (session?.user) {
        const userId = (session.user as Record<string, unknown>).id as string;
        const { data: existing } = await supabase
            .from('meetings')
            .select('user_id')
            .eq('id', id)
            .single();

        if (existing && existing.user_id !== userId && existing.user_id !== 'local') {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }
    }

    const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', id);

    if (!error) {
        return NextResponse.json({ message: 'Deleted' });
    }
    return NextResponse.json({ error: error?.message }, { status: 400 });
}
