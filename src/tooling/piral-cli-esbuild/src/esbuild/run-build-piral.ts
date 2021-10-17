import type { LogLevels } from 'piral-cli';
import { setStandardEnvs } from 'piral-cli/utils';
import { runEsbuild } from './bundler-run';
import { createConfig } from '../configs/piral';

async function run(
  root: string,
  piral: string,
  emulator: boolean,
  sourceMaps: boolean,
  contentHash: boolean,
  minify: boolean,
  externals: Array<string>,
  publicUrl: string,
  outDir: string,
  entryFiles: string,
  logLevel: LogLevels,
) {
  setStandardEnvs({
    production: !emulator,
    root,
    debugPiral: emulator,
    debugPilet: emulator,
    piral,
    dependencies: externals,
  });

  const config = createConfig(entryFiles, outDir, externals, emulator, sourceMaps, contentHash, minify, publicUrl);
  const bundler = runEsbuild(config, logLevel, false);
  return bundler.bundle();
}

process.on('message', async (msg) => {
  switch (msg.type) {
    case 'start':
      const result = await run(
        process.cwd(),
        msg.piral,
        msg.emulator,
        msg.sourceMaps,
        msg.contentHash,
        msg.minify,
        msg.externals,
        msg.publicUrl,
        msg.outDir,
        msg.entryFiles,
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
