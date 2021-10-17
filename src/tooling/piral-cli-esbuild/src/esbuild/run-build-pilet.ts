import type { PiletSchemaVersion, LogLevels, SharedDependency } from 'piral-cli';
import { setStandardEnvs } from 'piral-cli/utils';
import { runEsbuild } from './bundler-run';
import { createConfig } from '../configs/pilet';

async function run(
  root: string,
  piral: string,
  sourceMaps: boolean,
  contentHash: boolean,
  minify: boolean,
  externals: Array<string>,
  importmap: Array<SharedDependency>,
  outDir: string,
  outFile: string,
  entryModule: string,
  version: PiletSchemaVersion,
  logLevel: LogLevels,
) {
  setStandardEnvs({
    production: true,
    piral,
    root,
  });

  const config = createConfig(
    entryModule,
    outDir,
    outFile,
    externals,
    importmap,
    version,
    false,
    sourceMaps,
    contentHash,
    minify,
  );

  const bundler = runEsbuild(config, logLevel, false);
  return await bundler.bundle();
}

process.on('message', async (msg) => {
  switch (msg.type) {
    case 'start':
      const result = await run(
        process.cwd(),
        msg.piral,
        msg.sourceMaps,
        msg.contentHash,
        msg.minify,
        msg.externals,
        msg.importmap,
        msg.outDir,
        msg.outFile,
        msg.entryModule,
        msg.version,
        msg.logLevel,
      ).catch((error) => {
        process.send({
          type: 'fail',
          error: error?.message,
        });
      });

      if (result) {
        process.send({
          type: 'done',
          outDir: result.outDir,
          outFile: result.outFile,
        });
      }

      break;
  }
});
