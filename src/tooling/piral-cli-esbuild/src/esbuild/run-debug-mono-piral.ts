import type { LogLevels } from 'piral-cli';
import { setStandardEnvs, progress, logReset } from 'piral-cli/utils';
import { resolve } from 'path';
import { runEsbuild } from './bundler-run';
import { createConfig } from '../configs/piral';

async function run(
  root: string,
  piral: string,
  hmr: boolean,
  externals: Array<string>,
  entryFiles: string,
  logLevel: LogLevels,
) {
  progress(`Preparing supplied Piral instance ...`);

  const outDir = resolve(root, 'dist', 'app');

  setStandardEnvs({
    piral,
    dependencies: externals,
    production: false,
    debugPiral: true,
    debugPilet: true,
    root,
  });

  const config = createConfig(entryFiles, outDir, externals, true, true, false, false, undefined, hmr);
  const bundler = runEsbuild(config, logLevel, true);
  const bundle = await bundler.bundle();
  logReset();
  return bundle;
}

process.on('message', async (msg) => {
  switch (msg.type) {
    case 'start':
      const result = await run(process.cwd(), msg.piral, true, msg.externals, msg.entryFiles, msg.logLevel).catch(
        (error) => {
          process.send({
            type: 'fail',
            error: error?.message,
          });
        },
      );

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
