import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET() {
    try {
        const [polis] = await pool.query("SELECT * FROM poli ORDER BY id");
        const [dokters] = await pool.query(`
            SELECT d.*, p.nama_poli 
            FROM dokter d 
            LEFT JOIN poli p ON d.poli_id = p.id 
            ORDER BY d.id
        `);
        const [[{total_dokter}]] = await pool.query("SELECT COUNT(*) as total_dokter FROM dokter");
        const [[{total_poli}]] = await pool.query("SELECT COUNT(*) as total_poli FROM poli");
        const [[{total_reservasi}]] = await pool.query("SELECT COUNT(*) as total_reservasi FROM reservasi");

        return NextResponse.json({
            polis,
            dokters,
            stats: {
                total_dokter,
                total_poli,
                total_reservasi
            }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
