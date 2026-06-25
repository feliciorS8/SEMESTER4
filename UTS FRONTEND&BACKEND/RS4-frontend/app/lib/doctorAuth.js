import { NextResponse } from 'next/server';

export function createDoctorToken(id) {
    return `doctor-${id}`;
}

export function getDoctorIdFromRequest(request) {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    const match = token.match(/^doctor-(\d+)$/);
    return match ? Number(match[1]) : null;
}

export function verifyDoctorRequest(request) {
    const dokterId = getDoctorIdFromRequest(request);

    if (!dokterId) {
        return { error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }), dokterId: null };
    }

    return { error: null, dokterId };
}
