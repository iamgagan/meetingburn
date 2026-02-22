import { NextRequest, NextResponse } from 'next/server';

// GET /api/meetings/[id] — Get a single meeting
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Placeholder: In production, fetch from Supabase
    return NextResponse.json({
        message: `Meeting ${id} endpoint ready. Connect Supabase for persistent storage.`,
    });
}

// PATCH /api/meetings/[id] — Update a meeting (e.g., toggle public)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();

    // Placeholder
    return NextResponse.json({
        message: `Meeting ${id} updated`,
        updates: body,
    });
}

// DELETE /api/meetings/[id] — Delete a meeting
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Placeholder
    return NextResponse.json({
        message: `Meeting ${id} deleted`,
    });
}
