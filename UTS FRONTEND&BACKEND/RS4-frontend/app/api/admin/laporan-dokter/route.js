import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { verifyAdminRequest } from '@/app/lib/adminAuth';
import { buildDateFilter } from '@/app/lib/dateFilter';

export async function GET(request) {
    const authError = verifyAdminRequest(request);
    if (authError) return authError;

    try {
        const { searchParams } = new URL(request.url);
        const dateFilter = buildDateFilter(searchParams, 'r.tanggal_reservasi');
        const dateClause = dateFilter.clauses.length ? ` AND ${dateFilter.clauses.join(' AND ')}` : '';

        const [rows] = await pool.query(`
            SELECT
                d.id,
                d.nama_dokter,
                d.spesialisasi,
                p.nama_poli,
                COUNT(r.id) as total_pasien,
                COALESCE(SUM(CASE WHEN r.id IS NULL THEN 0 ELSE d.harga_jual END), 0) as total_pendapatan,
                COALESCE(SUM(CASE WHEN r.id IS NULL THEN 0 ELSE d.harga_beli END), 0) as pendapatan_dokter,
                COALESCE(SUM(CASE WHEN r.id IS NULL THEN 0 ELSE d.harga_jual - d.harga_beli END), 0) as pendapatan_rs
            FROM dokter d
            LEFT JOIN poli p ON d.poli_id = p.id
            LEFT JOIN reservasi r ON r.dokter_id = d.id AND r.status = 'cancelled'${dateClause}
            GROUP BY d.id, d.nama_dokter, d.spesialisasi, p.nama_poli
            ORDER BY pendapatan_dokter DESC, d.nama_dokter ASC
        `, dateFilter.params);

        return NextResponse.json({ data: rows });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
