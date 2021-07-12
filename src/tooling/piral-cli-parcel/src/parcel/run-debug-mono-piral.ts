import { LogLevels } from 'piral-cli';
import { resolve, dirname, basename } from 'path';
import { log, progress, logReset, setStandardEnvs } from 'piral-cli/utils';
import { setupBundler } from './bundler';
import { defaultCacheDir } from './constants';

async function run(root: string, piral: string, externals: Array<string>, entryFiles: string, logLevel: LogLevels) {
  progress(`Preparing supplied Piral instance ...`);

  const outDir = resolve(root, 'dist', 'app');
  const cacheDir = resolve(root, defaultCacheDir);

  setStandardEnvs({
    piral,
    dependencies: externals,
    production: false,
    debugPiral: true,
    debugPilet: true,
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
      publicUrl: '/',
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

  logReset();

  return bundle.name;
}

process.on('message', async (msg) => {
  switch (msg.type) {
    case 'start':
      const outPath = await run(process.cwd(), msg.piral, msg.externals, msg.entryFiles, msg.logLevel).catch(
        (error) => {
          process.send({
            type: 'fail',
            error: error?.message,
          });
        },
      );

      if (outPath) {
        process.send({
          type: 'done',
          outDir: dirname(outPath),
          outFile: basename(outPath),
        });
      }

      break;
  }
});
