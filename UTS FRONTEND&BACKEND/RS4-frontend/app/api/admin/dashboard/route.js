import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { verifyAdminRequest } from '@/app/lib/adminAuth';

export async function GET(request) {
    const authError = verifyAdminRequest(request);
    if (authError) return authError;

    try {
        const [[{ total_dokter }]] = await pool.query('SELECT COUNT(*) as total_dokter FROM dokter');
        const [[{ total_poli }]] = await pool.query('SELECT COUNT(*) as total_poli FROM poli');
        const [[{ total_reservasi }]] = await pool.query('SELECT COUNT(*) as total_reservasi FROM reservasi');

        const [revenueData] = await pool.query(`
            SELECT
                DATE(r.created_at) as tanggal,
                COUNT(r.id) as total_pasien,
                SUM(d.harga_jual) as total_pendapatan,
                SUM(d.harga_beli) as pendapatan_dokter,
                SUM(d.harga_jual - d.harga_beli) as pendapatan_sistem
            FROM reservasi r
            JOIN dokter d ON r.dokter_id = d.id
            WHERE r.status = 'cancelled'
            GROUP BY DATE(r.created_at)
            ORDER BY DATE(r.created_at) DESC
            LIMIT 7
        `);

        const [[totalData]] = await pool.query(`
            SELECT
                SUM(d.harga_jual) as total_pendapatan,
                SUM(d.harga_beli) as total_dokter,
                SUM(d.harga_jual - d.harga_beli) as total_sistem
            FROM reservasi r
            JOIN dokter d ON r.dokter_id = d.id
            WHERE r.status = 'cancelled'
        `);

        return NextResponse.json({
            total_dokter,
            total_poli,
            total_reservasi,
            total_pendapatan: totalData.total_pendapatan || 0,
            total_dokter_cut: totalData.total_dokter || 0,
            total_sistem_cut: totalData.total_sistem || 0,
            revenue_harian: revenueData
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
