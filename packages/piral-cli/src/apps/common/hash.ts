import { createHash } from 'crypto';

export function computeHash(content: string) {
  const sha1sum = createHash('sha1');
  sha1sum.update(content || '');
  return sha1sum.digest('hex');
}
