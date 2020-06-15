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
  develop: boolean,
  sourceMaps: boolean,
  contentHash: boolean,
  _detailedReport: boolean,
  minify: boolean,
  _cacheDir: string,
  externals: Array<string>,
  publicUrl: string,
  _outFile: string,
  outDir: string,
  entryFiles: string,
  _logLevel: LogLevels,
) {
  setStandardEnvs({
    production: !develop,
    root,
    debugPiral: develop,
    debugPilet: develop,
    piral,
    dependencies: externals,
  });

  const otherConfigPath = resolve(root, defaultWebpackConfig);
  const baseConfig = await getPiralConfig(
    root,
    entryFiles,
    outDir,
    develop,
    sourceMaps,
    contentHash,
    minify,
    false,
    publicUrl,
  );
  const wpConfig = extendConfig(baseConfig, otherConfigPath, {
    watch: false,
  });

  const bundler = runWebpack(wpConfig);
  return bundler.bundle();
}

process.on('message', async msg => {
  switch (msg.type) {
    case 'start':
      const result = await run(
        process.cwd(),
        msg.piral,
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
      ).catch(error => {
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
