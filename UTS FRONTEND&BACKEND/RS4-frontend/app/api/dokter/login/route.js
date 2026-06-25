import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { createDoctorToken } from '@/app/lib/doctorAuth';
import { hashPassword, isHashedPassword, verifyPassword } from '@/app/lib/password';
import { ensureDokterSchema } from '@/app/lib/schema';

export async function POST(request) {
    try {
        await ensureDokterSchema();

        const { username, password } = await request.json();
        const [dokters] = await pool.query('SELECT * FROM dokter WHERE username = ?', [username]);

        if (dokters.length === 0) {
            return NextResponse.json({ message: 'Username atau password dokter salah!' }, { status: 401 });
        }

        const dokter = dokters[0];
        const passwordValid = isHashedPassword(dokter.password)
            ? verifyPassword(password, dokter.password)
            : password === dokter.password;

        if (!passwordValid) {
            return NextResponse.json({ message: 'Username atau password dokter salah!' }, { status: 401 });
        }

        if (!isHashedPassword(dokter.password)) {
            await pool.query('UPDATE dokter SET password = ? WHERE id = ?', [hashPassword(password), dokter.id]);
        }

        return NextResponse.json({
            message: 'Login dokter berhasil',
            token: createDoctorToken(dokter.id),
            dokter: {
                id: dokter.id,
                nama_dokter: dokter.nama_dokter,
                username: dokter.username
            }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
