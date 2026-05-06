import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET(request, { params }) {
    try {
        const { poli_id } = await params;
        const [dokters] = await pool.query("SELECT * FROM dokter WHERE poli_id = ?", [poli_id]);
        return NextResponse.json(dokters);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
