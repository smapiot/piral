import { basename, dirname, resolve } from 'path';
import { analyzeCss } from 'css-conflict-inspector';
import { checkExists, getFileNames, readText } from '../common';
import { PiletRuleContext } from '../types';

export type Options = number;

async function getPiletCssPaths(main: string, baseDir: string) {
  const paths = [main, `dist/${main}`, `${main}/index.js`, `dist/${main}/index.js`, 'index.js', 'dist/index.js'];

  for (const path of paths) {
    const outDir = dirname(resolve(baseDir, path));
    const exists = await checkExists(outDir);

    if (exists) {
      const files = await getFileNames(outDir);
      return files.filter((m) => m.endsWith('.css')).map((m) => resolve(outDir, m));
    }
  }

  return [];
}

async function getCssScore(dir: string, file: string) {
  const content = await readText(dir, file);
  const result = analyzeCss(content);
  return result.score;
}

/**
 * Checks if a pilet might cause a CSS conflict. A score of 100 means that
 * there is the least chance of a CSS conflict, while a score of 0 means that
 * a CSS conflict is most likely.
 *
 * Negative values yield a warning if the CSS score is below the given number.
 *
 * Positive values yield an error if the CSS score is below the given number.
 *
 * A value of 0 turns this validation off.
 *
 * By default, a pilet's stylesheet having a CSS score of below 50 will result in a warning.
 */
export default async function (context: PiletRuleContext, options: Options = -50) {
  if (options !== 0 && typeof options === 'number') {
    const threshold = Math.abs(options);
    const { main } = context.piletPackage;
    const paths = await getPiletCssPaths(main, context.root);

    for (const path of paths) {
      const dir = dirname(path);
      const file = basename(path);
      const score = await getCssScore(dir, file);

      if (score < threshold) {
        const notify = options > 0 ? context.error : context.warning;
        notify(
          `
The CSS in "${file}" might lead to conflicts.
  Minimum: ${threshold} points.
  Received: ${score} points.
`,
        );
      }
    }
  }
}
