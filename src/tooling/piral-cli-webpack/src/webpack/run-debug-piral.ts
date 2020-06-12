import { LogLevels } from 'piral-cli';
import { setStandardEnvs } from 'piral-cli/utils';
import { resolve } from 'path';
import { runWebpack } from './bundler-run';
import { getPiralConfig } from '../configs';
import { extendConfig } from '../helpers';
import { defaultWebpackConfig } from '../constants';

async function run(
  root: string,
  piral: string,
  _scopeHoist: boolean,
  _autoInstall: boolean,
  hmr: boolean,
  _cacheDir: string,
  externals: Array<string>,
  publicUrl: string,
  entryFiles: string,
  _logLevel: LogLevels,
) {
  setStandardEnvs({
    root,
    debugPiral: true,
    dependencies: externals,
    piral,
  });

  const otherConfigPath = resolve(root, defaultWebpackConfig);
  const dist = resolve(root, 'dist');
  const baseConfig = await getPiralConfig(root, entryFiles, dist, true, true, false, false, publicUrl);
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
        msg.hmr,
        msg.cacheDir,
        msg.externals,
        msg.publicUrl,
        msg.entryFiles,
        msg.logLevel,
      ).catch(error => {
        process.send({
          type: 'fail',
          error: error?.message,
        });
      });

      if (bundler) {
        bundler.on('bundled', () => {
          process.send({
            type: 'update',
            outHash: bundler.mainBundle.entryAsset.hash,
            outName: bundler.mainBundle.name.substr(bundler.options.outDir.length + 1),
            args: {
              root,
            },
          });
        });

        process.send({
          type: 'done',
          outDir: bundler.options.outDir,
        });
      }

      break;
  }
});
