import type { LogLevels } from 'piral-cli';
import { setStandardEnvs, progress, getFreePort, logReset } from 'piral-cli/utils';
import { resolve } from 'path';
import { runWebpack } from './bundler-run';
import { extendConfig } from '../helpers';
import { getPiralConfig } from '../configs';
import { defaultWebpackConfig } from '../constants';

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

  const otherConfigPath = resolve(root, defaultWebpackConfig);
  const hmrPort = hmr ? await getFreePort(62123) : 0;
  const baseConfig = await getPiralConfig(
    root,
    entryFiles,
    outDir,
    externals,
    true,
    true,
    false,
    false,
    undefined,
    hmrPort,
  );
  const wpConfig = extendConfig(baseConfig, otherConfigPath, {
    watch: true,
  });

  const bundler = runWebpack(wpConfig, logLevel);
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
