import crypto from 'crypto';

export function getSalt() {
  return crypto.randomBytes(16).toString('hex');
}

export function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}