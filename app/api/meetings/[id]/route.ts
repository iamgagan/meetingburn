import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/meetings/[id] — Get a single meeting (public reports)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Try Supabase first
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
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();

    if (supabaseUrl) {
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

    return NextResponse.json({ message: `Meeting ${id} updated`, updates: body });
}

// DELETE /api/meetings/[id] — Delete a meeting
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (supabaseUrl) {
        const { error } = await supabase
            .from('meetings')
            .delete()
            .eq('id', id);

        if (!error) {
            return NextResponse.json({ message: 'Deleted' });
        }
        return NextResponse.json({ error: error?.message }, { status: 400 });
    }

    return NextResponse.json({ message: `Meeting ${id} deleted` });
}
