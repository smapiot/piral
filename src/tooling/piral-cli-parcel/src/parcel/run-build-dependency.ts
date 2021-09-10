import { dirname, basename } from 'path';
import type { LogLevels, PiletSchemaVersion, SharedDependency } from 'piral-cli';
import { setStandardEnvs, removeDirectory } from 'piral-cli/utils';
import { setupBundler, postProcess } from './bundler';

async function run(
  root: string,
  cacheDir: string,
  externals: Array<string>,
  importmap: Array<SharedDependency>,
  targetDir: string,
  outFile: string,
  outDir: string,
  entryModule: string,
  logLevel: LogLevels,
  version: PiletSchemaVersion,
  name: string
) {
  // using different environment variables requires clearing the cache
  await removeDirectory(cacheDir);

  setStandardEnvs({
    production: true,
    root,
  });

  const bundler = setupBundler({
    type: 'dependency',
    externals,
    targetDir,
    entryModule,
    importmap,
    config: {
      outFile,
      outDir,
      cacheDir,
      watch: false,
      sourceMaps: true,
      minify: true,
      scopeHoist: false,
      contentHash: false,
      detailedReport: false,
      publicUrl: './',
      logLevel,
    },
  });

  const bundle = await bundler.bundle();
  await postProcess(bundle, name, version, true, importmap, true);
  return bundle.name;
}

process.on('message', async (msg) => {
  switch (msg.type) {
    case 'start':
      const outPath = await run(
        process.cwd(),
        msg.cacheDir,
        msg.externals,
        msg.importmap,
        msg.targetDir,
        msg.outFile,
        msg.outDir,
        msg.entryModule,
        msg.logLevel,
        msg.version,
        msg.name,
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
