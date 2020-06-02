import { LogLevels } from 'piral-cli';
import { setStandardEnvs } from 'piral-cli/utils';
import { setupBundler } from './bundler';

async function run(
  root: string,
  piral: string,
  scopeHoist: boolean,
  autoInstall: boolean,
  hmr: boolean,
  cacheDir: string,
  externals: Array<string>,
  publicUrl: string,
  entryFiles: string,
  logLevel: LogLevels,
) {
  setStandardEnvs({
    root,
    debugPiral: true,
    dependencies: externals,
    piral,
  });

  const bundler = setupBundler({
    type: 'piral',
    entryFiles,
    config: {
      publicUrl,
      logLevel,
      cacheDir,
      scopeHoist,
      hmr,
      autoInstall,
    },
  });

  return bundler;
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
          error,
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
