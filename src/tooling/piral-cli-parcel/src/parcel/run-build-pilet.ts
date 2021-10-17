import { dirname, basename } from 'path';
import type { LogLevels, PiletSchemaVersion, SharedDependency } from 'piral-cli';
import { setStandardEnvs, removeDirectory } from 'piral-cli/utils';
import { setupBundler, postProcess } from './bundler';

async function run(
  root: string,
  piral: string,
  scopeHoist: boolean,
  sourceMaps: boolean,
  contentHash: boolean,
  detailedReport: boolean,
  minify: boolean,
  cacheDir: string,
  externals: Array<string>,
  importmap: Array<SharedDependency>,
  targetDir: string,
  outFile: string,
  outDir: string,
  entryModule: string,
  logLevel: LogLevels,
  version: PiletSchemaVersion,
) {
  // using different environment variables requires clearing the cache
  await removeDirectory(cacheDir);

  setStandardEnvs({
    production: true,
    piral,
    root,
  });

  const bundler = setupBundler({
    type: 'pilet',
    externals,
    importmap,
    targetDir,
    entryModule,
    config: {
      outFile,
      outDir,
      cacheDir,
      watch: false,
      sourceMaps,
      minify,
      scopeHoist,
      contentHash,
      publicUrl: './',
      detailedReport,
      logLevel,
    },
  });

  const name = process.env.BUILD_PCKG_NAME;
  const bundle = await bundler.bundle();
  await postProcess(bundle, name, version, minify, importmap);
  return bundle.name;
}

process.on('message', async (msg) => {
  switch (msg.type) {
    case 'start':
      const outPath = await run(
        process.cwd(),
        msg.piral,
        msg.scopeHoist,
        msg.sourceMaps,
        msg.contentHash,
        msg.detailedReport,
        msg.minify,
        msg.cacheDir,
        msg.externals,
        msg.importmap,
        msg.targetDir,
        msg.outFile,
        msg.outDir,
        msg.entryModule,
        msg.logLevel,
        msg.version,
      ).catch((error) => {
        process.send({
          type: 'fail',
          error: error?.message,
        });
      });

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
