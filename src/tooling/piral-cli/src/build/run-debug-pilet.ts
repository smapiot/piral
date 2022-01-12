import type {
  PiletSchemaVersion,
  LogLevels,
  SharedDependency,
  BundleHandlerResponse,
  PiletBuildHandler,
} from '../types';
import { setStandardEnvs } from '../common';
import { resolve } from 'path';

let handler: PiletBuildHandler;
let bundler: BundleHandlerResponse;

function run(
  root: string,
  targetDir: string,
  outDir: string,
  piral: string,
  externals: Array<string>,
  importmap: Array<SharedDependency>,
  entryModule: string,
  version: PiletSchemaVersion,
  logLevel: LogLevels,
  args: any,
) {
  setStandardEnvs({
    production: false,
    piral,
    root,
  });
  return handler.create({
    root,
    piral,
    entryModule,
    targetDir,
    outDir,
    outFile: 'index.js',
    externals,
    importmap,
    version,
    develop: true,
    sourceMaps: true,
    contentHash: true,
    minify: false,
    logLevel,
    watch: true,
    args,
  });
}

process.on('message', async (msg) => {
  const root = process.cwd();

  try {
    switch (msg.type) {
      case 'init':
        handler = require(msg.path);
        break;
      case 'bundle':
        if (bundler) {
          await bundler.bundle();
        }

        break;
      case 'start':
        const dist = resolve(root, 'dist');
        bundler = await run(
          root,
          msg.targetDir,
          dist,
          msg.piral,
          msg.externals,
          msg.importmap,
          msg.entryModule,
          msg.version,
          msg.logLevel,
          msg,
        );

        if (bundler) {
          bundler.onStart(() => {
            process.send({
              type: 'pending',
            });
          });
          bundler.onEnd((result) => {
            if (msg.hmr) {
              process.send({
                type: 'update',
                outHash: result.hash,
                outName: result.name,
                args: {
                  requireRef: result.requireRef,
                  version: msg.version,
                  root,
                },
              });
            }
          });

          process.send({
            type: 'done',
            outDir: dist,
          });
        }

        break;
    }
  } catch (error) {
    process.send({
      type: 'fail',
      error: error?.message,
    });
  }
});
