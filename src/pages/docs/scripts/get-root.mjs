import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

export function getRoot() {
  const current = dirname(fileURLToPath(import.meta.url));
  return resolve(current, '..', '..', '..', '..', 'docs');
}
