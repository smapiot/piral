import { resolve, relative } from 'path';
import { createGunzip } from 'zlib';
import { EventEmitter } from 'events';
import { log } from './log';
import { tar } from '../external';
import { PackageFiles } from '../types';

interface ReadEntry extends EventEmitter {
  path: string;
  mode: number;
  ignore: boolean;
}

export function createTarball(sourceDir: string, targetDir: string, targetFile: string) {
  const folder = relative(targetDir, sourceDir);
  log('generalDebug_0003', `Create archive "${targetFile}" in "${targetDir}" containing "${folder}".`);
  return tar.create(
    {
      file: resolve(targetDir, targetFile),
      cwd: targetDir,
    },
    [folder],
  );
}

export function unpackTarball(sourceDir: string, sourceFile: string) {
  log('generalDebug_0003', `Extract files from "${sourceFile}" in "${sourceDir}".`);
  return tar.extract({
    file: resolve(sourceDir, sourceFile),
    keep: false,
    cwd: sourceDir,
  });
}

export function unpackGzTar(stream: NodeJS.ReadableStream): Promise<PackageFiles> {
  const TarParser = tar.Parse as any;

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
