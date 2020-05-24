import { relative } from 'path';
import { LogLevels } from 'piral-cli';
import { setStandardEnvs, progress, removeDirectory } from 'piral-cli/utils';
import { setupBundler, gatherJsBundles, patchModules } from './bundler';

async function run(
  root: string,
  piral: string,
  optimizeModules: boolean,
  scopeHoist: boolean,
  develop: boolean,
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
  ignored: Array<string>,
) {
  if (optimizeModules) {
    progress('Preparing modules ...');
    await patchModules(root, ignored);
  }

  // using different environment variables requires clearing the cache
  await removeDirectory(cacheDir);

  setStandardEnvs({
    production: !develop,
    root,
    debugPiral: develop,
    debugPilet: develop,
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
        msg.optimizeModules,
        msg.scopeHoist,
        msg.develop,
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
        msg.ignored,
      );
      const [file] = gatherJsBundles(bundle);
      process.send({
        type: 'done',
        outDir: msg.outDir,
        outFile: relative(msg.outDir, file?.src || msg.outDir),
      });
      break;
  }
});
