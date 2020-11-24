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
  sourceMaps: boolean,
  contentHash: boolean,
  minify: boolean,
  externals: Array<string>,
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

  const otherConfigPath = resolve(root, defaultWebpackConfig);
  const baseConfig = await getPiletConfig(
    root,
    entryModule,
    outDir,
    outFile,
    externals,
    piral,
    version,
    false,
    sourceMaps,
    contentHash,
    minify,
  );
  const wpConfig = extendConfig(baseConfig, otherConfigPath, {
    watch: false,
  });

  const bundler = runWebpack(wpConfig, logLevel);
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
