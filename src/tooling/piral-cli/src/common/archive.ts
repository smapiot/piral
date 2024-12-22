import { createGunzip } from 'zlib';
import { EventEmitter } from 'events';
import { createWriteStream } from 'fs';
import { resolve, relative } from 'path';
import { log } from './log';
import { tar } from '../external';
import { PackageFiles } from '../types';

interface ReadEntry extends EventEmitter {
  path: string;
  mode: number;
  ignore: boolean;
}

/**
 * Creates an npm-style tgz.
 */
export function createTgz(file: string, cwd: string, files: Array<string>) {
  const stream = createWriteStream(file);

  const tgz = tar.create(
    {
      cwd,
      prefix: 'package/',
      portable: true,
      follow: true,
      gzip: {
        level: 9,
      },
      // @ts-ignore
      mtime: new Date('1985-10-26T08:15:00.000Z'),
    },
    files,
  );

  tgz.pipe(stream, { end: true });

  return new Promise((finish) => stream.on('close', finish));
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
  const TarParser = tar.Parser;

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
