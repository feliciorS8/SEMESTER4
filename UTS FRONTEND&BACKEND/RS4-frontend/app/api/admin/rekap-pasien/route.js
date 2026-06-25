import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { verifyAdminRequest } from '@/app/lib/adminAuth';
import { ensureReservasiSchema } from '@/app/lib/schema';
import { buildDateFilter } from '@/app/lib/dateFilter';

export async function GET(request) {
    const authError = verifyAdminRequest(request);
    if (authError) return authError;

    try {
        await ensureReservasiSchema();
        const { searchParams } = new URL(request.url);
        const dateFilter = buildDateFilter(searchParams, 'r.tanggal_reservasi');
        const where = dateFilter.clauses.length ? `WHERE ${dateFilter.clauses.join(' AND ')}` : '';

        const [rows] = await pool.query(`
            SELECT
                r.id,
                r.nama_pasien,
                r.no_wa,
                r.tanggal_reservasi,
                r.keluhan,
                r.status,
                r.diagnosa,
                r.created_at,
                d.nama_dokter,
                d.harga_jual,
                d.harga_beli,
                p.nama_poli
            FROM reservasi r
            LEFT JOIN dokter d ON r.dokter_id = d.id
            LEFT JOIN poli p ON r.poli_id = p.id
            ${where}
            ORDER BY r.tanggal_reservasi ASC, r.created_at ASC
        `, dateFilter.params);

        return NextResponse.json({ data: rows });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
