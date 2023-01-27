import { tmpdir } from 'os';
import { join } from 'path';
import { Stream } from 'stream';
import { createWriteStream } from 'fs';

export function streamToFile(source: Stream, target: string) {
  const dest = createWriteStream(target);
  return new Promise<Array<string>>((resolve, reject) => {
    source.pipe(dest);
    source.on('error', (err) => reject(err));
    dest.on('finish', () => resolve([target]));
  });
}

export function getRandomTempFile() {
  const rid = Math.random().toString(36).split('.').pop();
  return join(tmpdir(), `microfrontend_${rid}.tgz`);
}
