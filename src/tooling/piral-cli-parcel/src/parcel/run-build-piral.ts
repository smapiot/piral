import { relative } from 'path';
import { LogLevels } from 'piral-cli';
import { setStandardEnvs, removeDirectory } from 'piral-cli/utils';
import { setupBundler, gatherJsBundles } from './bundler';

async function run(
  root: string,
  piral: string,
  scopeHoist: boolean,
  emulator: boolean,
  sourceMaps: boolean,
  contentHash: boolean,
  detailedReport: boolean,
  minify: boolean,
  cacheDir: string,
  externals: Array<string>,
  publicUrl: string,
  outFile: string,
  outDir: string,
  entryFiles: string,
  logLevel: LogLevels,
) {
  // using different environment variables requires clearing the cache
  await removeDirectory(cacheDir);

  setStandardEnvs({
    production: !emulator,
    root,
    debugPiral: emulator,
    debugPilet: emulator,
    piral,
    dependencies: externals,
  });

  const bundler = setupBundler({
    type: 'piral',
    entryFiles,
    config: {
      cacheDir,
      watch: false,
      sourceMaps,
      contentHash,
      minify,
      scopeHoist,
      detailedReport,
      publicUrl,
      logLevel,
      outDir,
      outFile,
    },
  });

  const bundle = await bundler.bundle();
  return bundle;
}

process.on('message', async msg => {
  switch (msg.type) {
    case 'start':
      const bundle = await run(
        process.cwd(),
        msg.piral,
        msg.scopeHoist,
        msg.emulator,
        msg.sourceMaps,
        msg.contentHash,
        msg.detailedReport,
        msg.minify,
        msg.cacheDir,
        msg.externals,
        msg.publicUrl,
        msg.outFile,
        msg.outDir,
        msg.entryFiles,
        msg.logLevel,
      ).catch(error => {
        process.send({
          type: 'fail',
          error: error?.message,
        });
      });

      if (bundle) {
        const [file] = gatherJsBundles(bundle);
        process.send({
          type: 'done',
          outDir: msg.outDir,
          outFile: relative(msg.outDir, file?.src || msg.outDir),
        });
      }

      break;
  }
});
