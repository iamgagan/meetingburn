import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET /api/meetings/[id] — Get a single meeting (public reports)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Use admin client to fetch by ID or public slug and ensure it's public
    const { data, error } = await supabaseAdmin
        .from('meetings')
        .select('*')
        .or(`id.eq.${id},public_slug.eq.${id}`)
        .eq('is_public', true)
        .single();

    if (!error && data) {
        return NextResponse.json(data);
    }

    return NextResponse.json(
        { error: 'Report not found or not public' },
        { status: 404 }
    );
}

// PATCH /api/meetings/[id] — Update a meeting (e.g., toggle public)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;

    // Verify ownership manually with admin client before updating
    const { data: existing } = await supabaseAdmin
        .from('meetings')
        .select('user_id')
        .eq('id', id)
        .single();

    if (!existing) {
        return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    if (existing.user_id !== userId) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
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

// DELETE /api/meetings/[id] — Delete a meeting
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;

    // Verify ownership manually with admin client before deleting
    const { data: existing } = await supabaseAdmin
        .from('meetings')
        .select('user_id')
        .eq('id', id)
        .single();

    if (!existing) {
        return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    if (existing.user_id !== userId) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const { error } = await supabaseAdmin
        .from('meetings')
        .delete()
        .eq('id', id);

    if (!error) {
        return NextResponse.json({ message: 'Deleted' });
    }
    return NextResponse.json({ error: error?.message }, { status: 400 });
}
