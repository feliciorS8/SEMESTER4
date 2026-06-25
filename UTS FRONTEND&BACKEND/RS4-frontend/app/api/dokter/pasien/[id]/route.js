import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { verifyDoctorRequest } from '@/app/lib/doctorAuth';
import { ensureReservasiSchema } from '@/app/lib/schema';

export async function PUT(request, { params }) {
    const { error, dokterId } = verifyDoctorRequest(request);
    if (error) return error;

    try {
        await ensureReservasiSchema();

        const { id } = await params;
        const { status, diagnosa } = await request.json();
        const allowedStatuses = ['pending', 'confirmed', 'cancelled'];
        const nextStatus = allowedStatuses.includes(status) ? status : 'confirmed';

        const [result] = await pool.query(
            'UPDATE reservasi SET status = ?, diagnosa = ? WHERE id = ? AND dokter_id = ?',
            [nextStatus, diagnosa || null, id, dokterId]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: 'Data pasien tidak ditemukan untuk dokter ini' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Data pasien berhasil diperbarui' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
