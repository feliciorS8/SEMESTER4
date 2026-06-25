import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { verifyAdminRequest } from '@/app/lib/adminAuth';
import { ensureReservasiSchema } from '@/app/lib/schema';

export async function PUT(request, { params }) {
    const authError = verifyAdminRequest(request);
    if (authError) return authError;

    try {
        await ensureReservasiSchema();
        const { id } = await params;
        const { status, diagnosa } = await request.json();
        await pool.query('UPDATE reservasi SET status=?, diagnosa=? WHERE id=?', [status, diagnosa || null, id]);
        return NextResponse.json({ message: 'Status berhasil diupdate' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
