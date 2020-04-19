import { resolve, dirname, basename } from 'path';
import { log, progress } from './log';
import { defaultCacheDir } from './info';
import { setStandardEnvs } from './envs';
import { setupBundler } from './bundler';
import { LogLevels, StandardEnvProps } from '../types';

async function run(root: string, entryFiles: string, logLevel: LogLevels, env: StandardEnvProps) {
  progress(`Preparing supplied Piral instance ...`);

  const outDir = resolve(root, 'dist', 'app');
  const cacheDir = resolve(root, defaultCacheDir);

  setStandardEnvs({
    ...env,
    root,
  });

  const bundler = setupBundler({
    type: 'piral',
    entryFiles,
    config: {
      watch: true,
      minify: false,
      sourceMaps: true,
      contentHash: false,
      publicUrl: './',
      logLevel,
      outDir,
      cacheDir,
      scopeHoist: false,
      hmr: false,
      autoInstall: false,
    },
  });

  const bundle = await bundler.bundle();

  bundler.on('bundled', () => {
    log('generalInfo_0000', `The Piral instance changed. Refresh your browser to get the latest changes.`);
  });

  return bundle.name;
}

process.on('message', async msg => {
  switch (msg.type) {
    case 'start':
      const outPath = await run(process.cwd(), msg.appFile, msg.logLevel, msg.env);
      process.send({
        type: 'done',
        outDir: dirname(outPath),
        outFile: basename(outPath),
      });
      break;
  }
});
