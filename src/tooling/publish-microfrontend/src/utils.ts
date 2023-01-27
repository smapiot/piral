import glob from 'glob';
import { stat, readFile } from 'fs/promises';
import { dirname, basename, resolve } from 'path';
import { MemoryStream } from 'piral-cli/src/common/MemoryStream';
import { downloadFile } from './http';
import { runCommand } from './scripts';

function runNpmProcess(args: Array<string>, target: string, output?: NodeJS.WritableStream) {
  const cwd = resolve(process.cwd(), target);
  return runCommand('npm', args, cwd, output);
}

async function findTarball(packageRef: string, target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runNpmProcess(['view', packageRef, 'dist.tarball', ...flags], target, ms);
  return ms.value;
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
      // TODO:
      // - Reduced files should be unique.
      // - can be a mix of directories and files - if files are matched take those, otherwise take directories
      // - for all matched directories look up if a `package.json` exists - if yes, run "npm pack" and replace the directory by the created npm package
      // Finally return these files (created npm packages should be taken from a tmp directory, following the download approach below)
      return allFiles.reduce((result, files) => [...result, ...files], []);
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
