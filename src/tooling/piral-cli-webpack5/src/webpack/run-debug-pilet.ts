import type { PiletSchemaVersion, LogLevels } from 'piral-cli';
import { setStandardEnvs } from 'piral-cli/utils';
import { resolve } from 'path';
import { runWebpack } from './bundler-run';
import { getPiletConfig } from '../configs';
import { extendConfig } from '../helpers';
import { defaultWebpackConfig } from '../constants';

async function run(
  root: string,
  piral: string,
  externals: Array<string>,
  entryModule: string,
  version: PiletSchemaVersion,
  logLevel: LogLevels,
) {
  setStandardEnvs({
    piral,
    root,
  });

  const otherConfigPath = resolve(root, defaultWebpackConfig);
  const dist = resolve(root, 'dist');
  const baseConfig = await getPiletConfig(
    root,
    entryModule,
    dist,
    'index.js',
    externals,
    piral,
    version,
    true,
    true,
    true,
    false,
  );
  const wpConfig = extendConfig(baseConfig, otherConfigPath, {
    watch: true,
  });

  return runWebpack(wpConfig, logLevel);
}

let bundler;

process.on('message', async (msg) => {
  const root = process.cwd();

  switch (msg.type) {
    case 'bundle':
      if (bundler) {
        await bundler.bundle();

        bundler.on('buildStart', () => {
          process.send({
            type: 'pending',
          });
        });
      }

      break;
    case 'start':
      bundler = await run(root, msg.piral, msg.externals, msg.entryModule, msg.version, msg.logLevel).catch((error) => {
        process.send({
          type: 'fail',
          error: error?.message,
        });
      });

      if (bundler) {
        bundler.on('bundled', async () => {
          if (msg.hmr) {
            process.send({
              type: 'update',
              outHash: bundler.mainBundle.entryAsset.hash,
              outName: bundler.mainBundle.name.substr(bundler.options.outDir.length),
              args: {
                requireRef: bundler.mainBundle.requireRef,
                version: msg.version,
                root,
              },
            });
          }
        });

        process.send({
          type: 'done',
          outDir: bundler.options.outDir,
        });
      }

      break;
  }
});
