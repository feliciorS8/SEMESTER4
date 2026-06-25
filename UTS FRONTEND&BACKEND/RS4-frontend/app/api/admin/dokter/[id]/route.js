import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import pool from '@/app/lib/db';
import { verifyAdminRequest } from '@/app/lib/adminAuth';
import { hashPassword } from '@/app/lib/password';
import { ensureDokterSchema } from '@/app/lib/schema';

async function saveDoctorPhoto(file) {
    if (!file || file.size === 0) return null;

    const uploadFolder = path.join(process.cwd(), 'static', 'images', 'doctors');
    await fs.mkdir(uploadFolder, { recursive: true });

    const ext = path.extname(file.name || '').toLowerCase() || '.jpg';
    const filename = `foto-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const bytes = await file.arrayBuffer();
    await fs.writeFile(path.join(uploadFolder, filename), Buffer.from(bytes));
    return filename;
}

export async function PUT(request, { params }) {
    const authError = verifyAdminRequest(request);
    if (authError) return authError;

    try {
        await ensureDokterSchema();
        const { id } = await params;
        const form = await request.formData();
        const foto = await saveDoctorPhoto(form.get('foto'));
        const password = form.get('password');

        let query = `
            UPDATE dokter
            SET nama_dokter=?, spesialisasi=?, poli_id=?, jadwal_hari=?, jadwal_jam=?, no_wa=?, harga_beli=?, harga_jual=?, username=?
            WHERE id=?
        `;
        let values = [
            form.get('nama_dokter'),
            form.get('spesialisasi'),
            form.get('poli_id'),
            form.get('jadwal_hari'),
            form.get('jadwal_jam'),
            form.get('no_wa'),
            form.get('harga_beli') || 0,
            form.get('harga_jual') || 0,
            form.get('username') || null,
            id
        ];

        if (foto) {
            query = `
                UPDATE dokter
                SET nama_dokter=?, spesialisasi=?, poli_id=?, jadwal_hari=?, jadwal_jam=?, no_wa=?, harga_beli=?, harga_jual=?, username=?, foto=?
                WHERE id=?
            `;
            values = [
                form.get('nama_dokter'),
                form.get('spesialisasi'),
                form.get('poli_id'),
                form.get('jadwal_hari'),
                form.get('jadwal_jam'),
                form.get('no_wa'),
                form.get('harga_beli') || 0,
                form.get('harga_jual') || 0,
                form.get('username') || null,
                foto,
                id
            ];
        }

        if (password) {
            query = query.replace(' WHERE id=?', ', password=? WHERE id=?');
            values.splice(values.length - 1, 0, hashPassword(password));
        }

        await pool.query(query, values);
        return NextResponse.json({ message: 'Data dokter berhasil diperbarui!' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const authError = verifyAdminRequest(request);
    if (authError) return authError;

    try {
        await ensureDokterSchema();
        const { id } = await params;
        await pool.query('DELETE FROM dokter WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Dokter berhasil dihapus!' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
