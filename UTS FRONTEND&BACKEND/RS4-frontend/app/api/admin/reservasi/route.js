import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { verifyAdminRequest } from '@/app/lib/adminAuth';
import { ensureReservasiSchema } from '@/app/lib/schema';

export async function GET(request) {
    const authError = verifyAdminRequest(request);
    if (authError) return authError;

    try {
        await ensureReservasiSchema();
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'all';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '5', 10);
        const offset = (page - 1) * limit;

        let countQuery = 'SELECT COUNT(*) as total FROM reservasi';
        let query = `
            SELECT r.*, d.nama_dokter, d.harga_jual, d.harga_beli, p.nama_poli
            FROM reservasi r
            LEFT JOIN dokter d ON r.dokter_id = d.id
            LEFT JOIN poli p ON r.poli_id = p.id
        `;
        const params = [];
        const countParams = [];

        if (status !== 'all') {
            countQuery += ' WHERE status = ?';
            query += ' WHERE r.status = ?';
            params.push(status);
            countParams.push(status);
        }

        query += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [[{ total }]] = await pool.query(countQuery, countParams);
        const [reservasis] = await pool.query(query, params);

        return NextResponse.json({
            data: reservasis,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
