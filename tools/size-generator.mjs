import { generateFileSizeReport } from '@jsenv/file-size-impact';
import { promises } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const packagesDir = resolve(currentDir, '..', 'src');
const manifestConfig = {};
const trackingConfig = {};

async function setPackages(subDir) {
  const dir = resolve(packagesDir, subDir);
  const names = await promises.readdir(dir);

  await Promise.all(
    names.map(async (name) => {
      const p = resolve(dir, name);
      const stat = await promises.stat(p);

      if (stat.isDirectory()) {
        const pj = resolve(p, 'package.json');
        const content = await promises.readFile(pj, 'utf8');
        const packageName = JSON.parse(content).name;
        const path = `./src/${subDir}/${name}/dist/release`;

        trackingConfig[packageName] = {
          [`${path}/*.html`]: true,
          [`${path}/*.js`]: true,
          [`${path}/*.css`]: true,
          [`${path}/*.map`]: false,
          [`${path}/*.svg`]: false,
          [`${path}/*.png`]: false,
          [`${path}/*.dat`]: false,
          [`${path}/*.dll`]: false,
          [`${path}/*.gz`]: false,
        };
      }
    }),
  );
}

await setPackages('samples');

export const fileSizeReport = await generateFileSizeReport({
  log: process.argv.includes('--log'),
  rootDirectoryUrl: new URL('../', import.meta.url),
  manifestConfig,
  trackingConfig,
});
