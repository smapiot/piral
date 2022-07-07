import { tmpdir } from 'os';
import { resolve, relative, join, dirname } from 'path';
import { createWriteStream, mkdtemp } from 'fs';
import { log, progress, fail } from './log';
import { readJson, copy, removeDirectory, checkExists } from './io';
import { getPossiblePiletMainPaths } from './inspect';
import { tar } from '../external';

async function getPiletContentDir(root: string, packageData: any) {
  const paths = getPossiblePiletMainPaths(packageData);

  for (const path of paths) {
    const file = resolve(root, path);

    if (await checkExists(file)) {
      return dirname(file);
    }
  }

  return root;
}

export function makeTempDir(prefix: string) {
  return new Promise<string>((resolve, reject) =>
    mkdtemp(prefix, (err, folder) => {
      if (err) {
        reject(err);
      } else {
        resolve(folder);
      }
    }),
  );
}

export function packContent(file: string, cwd: string, files: Array<string>) {
  const stream = createWriteStream(file);

  tar
    .c(
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
    )
    .pipe(stream, {
      end: true,
    });

  return new Promise((finish) => stream.on('close', finish));
}

export async function createPiletPackage(baseDir: string, source: string, target: string) {
  const root = resolve(baseDir, source);
  const dest = resolve(baseDir, target);
  log('generalDebug_0003', `Reading the package at "${root}" ...`);
  const pckg = await readJson(root, 'package.json');
  log('generalDebug_0003', 'Successfully read package.');

  if (!pckg) {
    fail('packageJsonNotFound_0020');
  }

  if (!pckg.name) {
    fail('packageJsonMissingName_0021');
  }

  if (!pckg.version) {
    fail('packageJsonMissingVersion_0022');
  }

  progress(`Packing pilet in ${dest} ...`);
  const pckgName = pckg.name.replace(/@/g, '').replace(/\//g, '-');
  const id = `${pckgName}-${pckg.version}`;
  const name = `${id}.tgz`;
  log('generalDebug_0003', `Assume package name "${name}".`);

  const file = resolve(dest, name);
  const content = await getPiletContentDir(root, pckg);
  const files = [resolve(root, 'package.json'), content];
  const prefix = join(tmpdir(), `${id}-`);
  const cwd = await makeTempDir(prefix);
  log('generalDebug_0003', `Creating package with content from "${content}" ...`);

  await Promise.all(files.map((file) => copy(file, resolve(cwd, relative(root, file)))));

  await packContent(
    file,
    cwd,
    files.map((f) => relative(root, f)),
  );

  log('generalDebug_0003', `Successfully created package from "${cwd}".`);

  await removeDirectory(cwd);

  log('generalDebug_0003', `Packed file "${file}".`);
  return file;
}
