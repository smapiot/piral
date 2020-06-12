import { LogLevels, PiletSchemaVersion } from 'piral-cli';
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
  sourceMaps: boolean,
  contentHash: boolean,
  _detailedReport: boolean,
  minify: boolean,
  _cacheDir: string,
  externals: Array<string>,
  targetDir: string,
  outFile: string,
  outDir: string,
  entryModule: string,
  _logLevel: LogLevels,
  _version: PiletSchemaVersion,
) {
  setStandardEnvs({
    production: true,
    piral,
    root,
  });

  const otherConfigPath = resolve(root, defaultWebpackConfig);
  const baseConfig = await getPiletConfig(
    root,
    entryModule,
    targetDir,
    externals,
    true,
    sourceMaps,
    contentHash,
    minify,
  );
  const wpConfig = extendConfig(baseConfig, otherConfigPath, {
    watch: false,
  });

  const bundler = runWebpack(wpConfig);
  return await bundler.bundle();
}

process.on('message', async msg => {
  switch (msg.type) {
    case 'start':
      const result = await run(
        process.cwd(),
        msg.piral,
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
