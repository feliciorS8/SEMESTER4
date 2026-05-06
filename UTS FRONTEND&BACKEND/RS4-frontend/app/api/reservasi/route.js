import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function POST(request) {
    try {
        const { nama_pasien, no_wa, poli_id, dokter_id, tanggal, keluhan } = await request.json();
        
        await pool.query(`
            INSERT INTO reservasi (nama_pasien, no_wa, poli_id, dokter_id, tanggal_reservasi, keluhan)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [nama_pasien, no_wa, poli_id, dokter_id, tanggal, keluhan]);

        const [[dokter]] = await pool.query("SELECT * FROM dokter WHERE id = ?", [dokter_id]);
        const [[poli]] = await pool.query("SELECT * FROM poli WHERE id = ?", [poli_id]);

        return NextResponse.json({
            message: 'Reservasi berhasil',
            data: {
                nama_pasien,
                poli_name: poli ? poli.nama_poli : '',
                nama_dokter: dokter ? dokter.nama_dokter : '',
                tanggal,
                keluhan,
                no_wa_dokter: dokter ? dokter.no_wa : ''
            }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
