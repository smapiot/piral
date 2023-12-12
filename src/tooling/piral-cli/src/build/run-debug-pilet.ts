import { setStandardEnvs } from '../common/envs';
import type {
  PiletSchemaVersion,
  LogLevels,
  SharedDependency,
  BundleHandlerResponse,
  PiletBuildHandler,
} from '../types';

let handler: PiletBuildHandler;
let bundler: BundleHandlerResponse;

function run(
  root: string,
  targetDir: string,
  outDir: string,
  outFile: string,
  piralInstances: Array<string>,
  externals: Array<string>,
  importmap: Array<SharedDependency>,
  entryModule: string,
  version: PiletSchemaVersion,
  logLevel: LogLevels,
  args: any,
) {
  setStandardEnvs({
    production: false,
    piralInstances,
    root,
  });

  return handler.create({
    root,
    piralInstances,
    entryModule,
    targetDir,
    outDir,
    outFile,
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

process.on('message', async (msg: any) => {
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
        bundler = await run(
          root,
          msg.targetDir,
          msg.outDir,
          msg.outFile,
          msg.piralInstances,
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
            outDir: msg.outDir,
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
