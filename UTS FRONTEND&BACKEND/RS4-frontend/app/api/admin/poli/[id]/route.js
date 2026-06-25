import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { verifyAdminRequest } from '@/app/lib/adminAuth';

export async function PUT(request, { params }) {
    const authError = verifyAdminRequest(request);
    if (authError) return authError;

    try {
        const { id } = await params;
        const { nama_poli, deskripsi } = await request.json();
        await pool.query('UPDATE poli SET nama_poli = ?, deskripsi = ? WHERE id = ?', [nama_poli, deskripsi, id]);
        return NextResponse.json({ message: 'Poli berhasil diupdate!' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const authError = verifyAdminRequest(request);
    if (authError) return authError;

    try {
        const { id } = await params;
        await pool.query('DELETE FROM poli WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Poli berhasil dihapus!' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
