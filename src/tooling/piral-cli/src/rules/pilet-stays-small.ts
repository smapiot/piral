import { stat } from 'fs';
import { resolve } from 'path';
import { checkExists } from '../common';
import { PiletRuleContext } from '../types';

export type Options = number;

async function getPiletMainPath(main: string, baseDir: string) {
  const paths = [main, `dist/${main}`, `${main}/index.js`, `dist/${main}/index.js`, 'index.js', 'dist/index.js'];

  for (const path of paths) {
    const filePath = resolve(baseDir, path);
    const exists = await checkExists(filePath);

    if (exists) {
      return filePath;
    }
  }

  return undefined;
}

function getFileSizeInKB(path: string) {
  return new Promise<number>((resolve, reject) => {
    stat(path, (err, stats) => {
      if (err) {
        reject(err);
      } else if (stats.isFile()) {
        // convert from bytes to kB
        resolve(stats.size / 1024);
      } else {
        reject(new Error('The given path is invalid. It must lead to a valid file'));
      }
    });
  });
}

/**
 * Checks if the main bundle of the pilet is not exceeding a given threshold.
 * The pilet must have been built beforehand for this validation to be conclusive.
 *
 * Negative values yield a warning if the absolute size in kB is exceeded.
 *
 * Positive values yield an error if the absolute size in kB is exceeded.
 *
 * A value of 0 turns this validation off.
 *
 * By default, a pilet's main bundle exceeding 50 kB will result in a warning.
 */
export default async function (context: PiletRuleContext, options: Options = -50) {
  if (options !== 0 && typeof options === 'number') {
    const maxSize = Math.abs(options);
    const { main } = context.piletPackage;
    const path = await getPiletMainPath(main, context.root);

    if (path) {
      const size = await getFileSizeInKB(path);

      if (size > maxSize) {
        const notify = options > 0 ? context.error : context.warning;
        notify(
          `
The main bundle is too large.
  Maximum: ${maxSize} kB.
  Received: ${size} kB.
`,
        );
      }
    }
  }
}
