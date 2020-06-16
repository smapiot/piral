import { setStandardEnvs } from 'piral-cli/utils';
import { resolve } from 'path';
import { runWebpack } from './bundler-run';
import { getPiralConfig } from '../configs';
import { extendConfig } from '../helpers';
import { defaultWebpackConfig } from '../constants';

async function run(
  root: string,
  piral: string,
  develop: boolean,
  sourceMaps: boolean,
  contentHash: boolean,
  minify: boolean,
  externals: Array<string>,
  publicUrl: string,
  outDir: string,
  entryFiles: string,
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
    externals,
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
        msg.develop,
        msg.sourceMaps,
        msg.contentHash,
        msg.minify,
        msg.externals,
        msg.publicUrl,
        msg.outDir,
        msg.entryFiles,
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
