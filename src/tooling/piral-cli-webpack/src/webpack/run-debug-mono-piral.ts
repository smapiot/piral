import { LogLevels } from 'piral-cli';
import { setStandardEnvs, progress } from 'piral-cli/utils';
import { resolve } from 'path';
import { runWebpack } from './bundler-run';
import { extendConfig } from '../helpers';
import { getPiralConfig } from '../configs';
import { defaultWebpackConfig } from '../constants';

async function run(root: string, piral: string, externals: Array<string>, entryFiles: string, _logLevel: LogLevels) {
  progress(`Preparing supplied Piral instance ...`);

  const outDir = resolve(root, 'dist', 'app');

  setStandardEnvs({
    piral,
    dependencies: externals,
    production: true,
    debugPiral: true,
    debugPilet: true,
    root,
  });

  const otherConfigPath = resolve(root, defaultWebpackConfig);
  const baseConfig = await getPiralConfig(root, entryFiles, outDir, true, true, false, false, true);
  const wpConfig = extendConfig(baseConfig, otherConfigPath, {
    watch: true,
  });

  const bundler = runWebpack(wpConfig);
  return await bundler.bundle();
}

process.on('message', async msg => {
  switch (msg.type) {
    case 'start':
      const result = await run(process.cwd(), msg.piral, msg.externals, msg.entryFiles, msg.logLevel).catch(error => {
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
