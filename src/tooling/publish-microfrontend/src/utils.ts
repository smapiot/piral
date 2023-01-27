import glob from 'glob';
import { existsSync, statSync } from 'fs';
import { stat, readFile, readdir, copyFile, rm } from 'fs/promises';
import { dirname, basename, resolve } from 'path';
import { MemoryStream } from 'piral-cli/src/common/MemoryStream';
import { downloadFile } from './http';
import { runCommand } from './scripts';
import { getRandomTempFile } from './io';

function runNpmProcess(args: Array<string>, target: string, output?: NodeJS.WritableStream) {
  const cwd = resolve(process.cwd(), target);
  return runCommand('npm', args, cwd, output);
}

async function findTarball(packageRef: string, target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runNpmProcess(['view', packageRef, 'dist.tarball', ...flags], target, ms);
  return ms.value;
}

async function createPackage(target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runNpmProcess(['pack', ...flags], target, ms);
  return ms.value;
}

function onlyUnique<T>(value: T, index: number, self: Array<T>) {
  return self.indexOf(value) === index;
}

function isFile(item: string) {
  return statSync(item).isFile();
}

function isDirectory(item: string) {
  return statSync(item).isDirectory();
}

function matchFiles(baseDir: string, pattern: string) {
  return new Promise<Array<string>>((resolve, reject) => {
    glob(
      pattern,
      {
        cwd: baseDir,
        absolute: true,
        dot: true,
      },
      (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      },
    );
  });
}

export async function getCa(cert: string | undefined): Promise<Buffer | undefined> {
  if (cert && typeof cert === 'string') {
    const statCert = await stat(cert).catch(() => undefined);

    if (statCert?.isFile()) {
      const dir = dirname(cert);
      const file = basename(cert);
      return await readFile(resolve(dir, file));
    }
  }

  return undefined;
}

export async function getFiles(
  baseDir: string,
  sources: Array<string>,
  from: string,
  ca: Buffer,
): Promise<Array<string>> {
  switch (from) {
    case 'local': {
      const allFiles = await Promise.all(sources.map((s) => matchFiles(baseDir, s)));
      const allMatches = allFiles.reduce((result, files) => [...result, ...files], []).filter(onlyUnique);

      if (allMatches.every(isDirectory)) {
        const dirs = allMatches.filter(m => existsSync(resolve(m, 'package.json')));        
        return Promise.all(dirs.map(async dir => {
          const previousFiles = await readdir(dir);
          await createPackage(dir);
          const currentFiles = await readdir(dir);
          const tarball = currentFiles.find(m => !previousFiles.includes(m) && m.endsWith('.tgz'));
          const target = getRandomTempFile();
          const source = resolve(dir, tarball);
          await copyFile(source, target);
          await rm(source);
          return target;
        }));
      }

      return allMatches.filter(isFile);
    }
    case 'remote': {
      const allFiles = await Promise.all(sources.map((s) => downloadFile(s, ca)));
      return allFiles.reduce((result, files) => [...result, ...files], []);
    }
    case 'npm': {
      const allUrls = await Promise.all(sources.map((s) => findTarball(s)));
      const allFiles = await Promise.all(allUrls.map((url) => downloadFile(url, ca)));
      return allFiles.reduce((result, files) => [...result, ...files], []);
    }
  }
}
