import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { verifyAdminRequest } from '@/app/lib/adminAuth';

export async function GET(request) {
    const authError = verifyAdminRequest(request);
    if (authError) return authError;

    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '5', 10);
        const offset = (page - 1) * limit;

        const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM poli');
        const [polis] = await pool.query('SELECT * FROM poli ORDER BY id DESC LIMIT ? OFFSET ?', [limit, offset]);

        return NextResponse.json({
            data: polis,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    const authError = verifyAdminRequest(request);
    if (authError) return authError;

    try {
        const { nama_poli, deskripsi } = await request.json();
        await pool.query('INSERT INTO poli (nama_poli, deskripsi) VALUES (?, ?)', [nama_poli, deskripsi]);
        return NextResponse.json({ message: 'Poli berhasil ditambahkan!' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
