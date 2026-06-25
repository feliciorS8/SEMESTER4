import pool from '@/app/lib/db';

let reservasiSchemaReady = false;
let dokterSchemaReady = false;

export async function ensureReservasiSchema() {
    if (reservasiSchemaReady) return;

    const [columns] = await pool.query('SHOW COLUMNS FROM reservasi');
    const columnNames = columns.map((column) => column.Field);

    if (!columnNames.includes('diagnosa')) {
        await pool.query('ALTER TABLE reservasi ADD COLUMN diagnosa TEXT NULL');
    }

    reservasiSchemaReady = true;
}

export async function ensureDokterSchema() {
    if (dokterSchemaReady) return;

    const [columns] = await pool.query('SHOW COLUMNS FROM dokter');
    const columnNames = columns.map((column) => column.Field);

    if (!columnNames.includes('username')) {
        await pool.query('ALTER TABLE dokter ADD COLUMN username VARCHAR(255) NULL UNIQUE');
    }

    if (!columnNames.includes('password')) {
        await pool.query('ALTER TABLE dokter ADD COLUMN password VARCHAR(255) NULL');
    }

    dokterSchemaReady = true;
}
