import { setStandardEnvs } from '../common/envs';
import type { BundleHandlerResponse, LogLevels, PiralBuildHandler } from '../types';

let handler: PiralBuildHandler;
let bundler: BundleHandlerResponse;

function run(
  root: string,
  outFile: string,
  outDir: string,
  piralInstances: Array<string>,
  hmr: boolean,
  externals: Array<string>,
  publicUrl: string,
  entryFiles: string,
  logLevel: LogLevels,
  args: any,
) {
  setStandardEnvs({
    root,
    debugPiral: true,
    dependencies: externals,
    publicPath: publicUrl,
    piralInstances,
  });

  return handler.create({
    root,
    entryFiles,
    outFile,
    outDir,
    externals,
    emulator: true,
    sourceMaps: true,
    contentHash: false,
    minify: false,
    publicUrl,
    hmr,
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
          msg.outFile,
          msg.outDir,
          msg.piralInstances,
          msg.hmr,
          msg.externals,
          msg.publicUrl,
          msg.entryFiles,
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
            process.send({
              type: 'update',
              outHash: result.hash,
              outName: 'index.html',
              args: {
                root,
              },
            });
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
