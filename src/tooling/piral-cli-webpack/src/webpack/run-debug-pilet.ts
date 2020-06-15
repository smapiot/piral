import { LogLevels } from 'piral-cli';
import { setStandardEnvs } from 'piral-cli/utils';
import { resolve } from 'path';
import { runWebpack } from './bundler-run';
import { getPiletConfig } from '../configs';
import { extendConfig } from '../helpers';
import { defaultWebpackConfig } from '../constants';

async function run(
  root: string,
  piral: string,
  _scopeHoist: boolean,
  _autoInstall: boolean,
  _cacheDir: string,
  externals: Array<string>,
  targetDir: string,
  entryModule: string,
  _logLevel: LogLevels,
) {
  setStandardEnvs({
    piral,
    root,
  });

  const otherConfigPath = resolve(root, defaultWebpackConfig);
  const baseConfig = await getPiletConfig(root, entryModule, targetDir, externals, true, true, false, false, true);
  const wpConfig = extendConfig(baseConfig, otherConfigPath, {
    watch: true,
  });

  return runWebpack(wpConfig);
}

let bundler;

process.on('message', async msg => {
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
      bundler = await run(
        root,
        msg.piral,
        msg.scopeHoist,
        msg.autoInstall,
        msg.cacheDir,
        msg.externals,
        msg.targetDir,
        msg.entryModule,
        msg.logLevel,
      ).catch(error => {
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
                requireRef: 'abc',
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
