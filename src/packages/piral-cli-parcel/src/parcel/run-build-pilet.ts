import { dirname, basename } from 'path';
import { LogLevels, PiletSchemaVersion } from 'piral-cli';
import { progress, setStandardEnvs, removeDirectory } from 'piral-cli/utils';
import { setupBundler, postProcess, patchModules } from './bundler';

async function run(
  root: string,
  piral: string,
  optimizeModules: boolean,
  scopeHoist: boolean,
  sourceMaps: boolean,
  contentHash: boolean,
  detailedReport: boolean,
  minify: boolean,
  cacheDir: string,
  externals: Array<string>,
  targetDir: string,
  outFile: string,
  outDir: string,
  entryModule: string,
  logLevel: LogLevels,
  version: PiletSchemaVersion,
  ignored: Array<string>,
) {
  if (optimizeModules) {
    progress('Preparing modules ...');
    await patchModules(root, ignored);
  }

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

  const bundle = await bundler.bundle();
  await postProcess(bundle, version);
  return bundle.name;
}

process.on('message', async msg => {
  switch (msg.type) {
    case 'start':
      const outPath = await run(
        process.cwd(),
        msg.piral,
        msg.optimizeModules,
        msg.scopeHoist,
        msg.sourceMaps,
        msg.contentHash,
        msg.detailedReport,
        msg.minify,
        msg.cacheDir,
        msg.externals,
        msg.targetDir,
        msg.outFile,
        msg.outDir,
        msg.entryModule,
        msg.logLevel,
        msg.version,
        msg.ignored,
      );
      process.send({
        type: 'done',
        outDir: dirname(outPath),
        outFile: basename(outPath),
      });
      break;
  }
});
