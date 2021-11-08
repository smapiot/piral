import { createHash } from 'crypto';

export function computeHash(content: string | Buffer = '') {
  return createHash('sha1').update(content).digest('hex');
}

export function computeMd5(content: string | Buffer = '') {
  return createHash('md5').update(content).digest('hex');
}

export function computeIntegrity(content: string) {
  const sum = createHash('sha256').update(content).digest('base64');
  return `sha256-${sum}`;
}
