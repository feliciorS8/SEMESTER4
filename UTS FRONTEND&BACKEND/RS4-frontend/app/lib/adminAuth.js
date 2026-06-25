import { NextResponse } from 'next/server';

export const ADMIN_TOKEN = 'rs-yasmin-admin-local-token';

export function verifyAdminRequest(request) {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (token !== ADMIN_TOKEN) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return null;
}
