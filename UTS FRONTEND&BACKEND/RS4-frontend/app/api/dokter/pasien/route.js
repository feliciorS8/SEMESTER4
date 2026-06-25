import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { verifyDoctorRequest } from '@/app/lib/doctorAuth';
import { buildDateFilter } from '@/app/lib/dateFilter';
import { ensureReservasiSchema } from '@/app/lib/schema';

export async function GET(request) {
    const { error, dokterId } = verifyDoctorRequest(request);
    if (error) return error;

    try {
        await ensureReservasiSchema();

        const { searchParams } = new URL(request.url);
        const dateFilter = buildDateFilter(searchParams, 'r.tanggal_reservasi');
        const whereClauses = ['r.dokter_id = ?'];
        const params = [dokterId];

        whereClauses.push(...dateFilter.clauses);
        params.push(...dateFilter.params);

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
                p.nama_poli,
                d.nama_dokter,
                d.harga_jual,
                d.harga_beli
            FROM reservasi r
            LEFT JOIN dokter d ON r.dokter_id = d.id
            LEFT JOIN poli p ON r.poli_id = p.id
            WHERE ${whereClauses.join(' AND ')}
            ORDER BY r.tanggal_reservasi ASC, r.created_at ASC
        `, params);

        return NextResponse.json({ data: rows });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
