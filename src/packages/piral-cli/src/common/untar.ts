import * as tar from 'tar';
import { createGunzip } from 'zlib';
import { EventEmitter } from 'events';
import { log } from './log';
import { PackageFiles } from '../types';

const TarParser = tar.Parse as any;

interface ReadEntry extends EventEmitter {
  path: string;
  mode: number;
  ignore: boolean;
}

export function untar(stream: NodeJS.ReadableStream): Promise<PackageFiles> {
  return new Promise((resolve, reject) => {
    const files: PackageFiles = {};
    log('generalDebug_0003', `Unpacking the stream ...`);
    stream
      .on('error', reject)
      .pipe(createGunzip())
      .on('error', reject)
      .pipe(new TarParser())
      .on('error', reject)
      .on('entry', (e: ReadEntry) => {
        const content: Array<Buffer> = [];
        const p = e.path;

        log('generalDebug_0003', `Found entry "${p}" in packed content.`);
        e.on('error', reject);
        e.on('data', (c: Buffer) => content.push(c));
        e.on('end', () => (files[p] = Buffer.concat(content)));
      })
      .on('end', () => resolve(files));
  });
}
