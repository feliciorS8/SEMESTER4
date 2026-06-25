import crypto from 'crypto';

const ITERATIONS = 120000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

export function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
    return `pbkdf2$${ITERATIONS}$${salt}$${hash}`;
}

export function verifyPassword(password, storedPassword) {
    if (!storedPassword) return false;

    const parts = storedPassword.split('$');
    if (parts.length !== 4 || parts[0] !== 'pbkdf2') {
        return false;
    }

    const iterations = Number(parts[1]);
    const salt = parts[2];
    const storedHash = parts[3];
    const hash = crypto.pbkdf2Sync(password, salt, iterations, KEY_LENGTH, DIGEST).toString('hex');

    const storedBuffer = Buffer.from(storedHash, 'hex');
    const hashBuffer = Buffer.from(hash, 'hex');
    if (storedBuffer.length !== hashBuffer.length) return false;

    return crypto.timingSafeEqual(storedBuffer, hashBuffer);
}

export function isHashedPassword(storedPassword) {
    return typeof storedPassword === 'string' && storedPassword.startsWith('pbkdf2$');
}
