import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import pool from '@/app/lib/db';
import { verifyAdminRequest } from '@/app/lib/adminAuth';
import { hashPassword } from '@/app/lib/password';
import { ensureDokterSchema } from '@/app/lib/schema';

async function saveDoctorPhoto(file) {
    if (!file || file.size === 0) return 'default-doctor.jpg';

    const uploadFolder = path.join(process.cwd(), 'static', 'images', 'doctors');
    await fs.mkdir(uploadFolder, { recursive: true });

    const ext = path.extname(file.name || '').toLowerCase() || '.jpg';
    const filename = `foto-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const bytes = await file.arrayBuffer();
    await fs.writeFile(path.join(uploadFolder, filename), Buffer.from(bytes));
    return filename;
}

export async function GET(request) {
    const authError = verifyAdminRequest(request);
    if (authError) return authError;

    try {
        await ensureDokterSchema();
        const [missingAccounts] = await pool.query('SELECT id FROM dokter WHERE username IS NULL OR username = "" OR password IS NULL OR password = ""');
        for (const dokter of missingAccounts) {
            await pool.query('UPDATE dokter SET username = ?, password = ? WHERE id = ?', [`dokter${dokter.id}`, hashPassword('dokter123'), dokter.id]);
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '5', 10);
        const offset = (page - 1) * limit;

        const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM dokter');
        const [dokters] = await pool.query(`
            SELECT d.*, p.nama_poli
            FROM dokter d
            LEFT JOIN poli p ON d.poli_id = p.id
            ORDER BY d.id DESC
            LIMIT ? OFFSET ?
        `, [limit, offset]);

        return NextResponse.json({
            data: dokters,
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
        await ensureDokterSchema();
        const form = await request.formData();
        const foto = await saveDoctorPhoto(form.get('foto'));
        const username = form.get('username') || `dokter${Date.now()}`;
        const password = form.get('password') || 'dokter123';

        await pool.query(`
            INSERT INTO dokter (nama_dokter, spesialisasi, poli_id, foto, jadwal_hari, jadwal_jam, no_wa, harga_beli, harga_jual, username, password)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            form.get('nama_dokter'),
            form.get('spesialisasi'),
            form.get('poli_id'),
            foto,
            form.get('jadwal_hari'),
            form.get('jadwal_jam'),
            form.get('no_wa'),
            form.get('harga_beli') || 0,
            form.get('harga_jual') || 0,
            username,
            hashPassword(password)
        ]);

        return NextResponse.json({ message: 'Dokter berhasil ditambahkan!' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
