import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { ADMIN_TOKEN } from '@/app/lib/adminAuth';
import { hashPassword, isHashedPassword, verifyPassword } from '@/app/lib/password';

export async function POST(request) {
    try {
        const { username, password } = await request.json();
        const [users] = await pool.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return NextResponse.json({ message: 'Username atau password salah!' }, { status: 401 });
        }

        const user = users[0];
        const passwordValid = isHashedPassword(user.password)
            ? verifyPassword(password, user.password)
            : password === user.password;

        if (!passwordValid) {
            return NextResponse.json({ message: 'Username atau password salah!' }, { status: 401 });
        }

        if (!isHashedPassword(user.password)) {
            await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashPassword(password), user.id]);
        }

        return NextResponse.json({
            message: 'Login successful',
            token: ADMIN_TOKEN,
            user: { id: user.id, username: user.username, role: user.role }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
