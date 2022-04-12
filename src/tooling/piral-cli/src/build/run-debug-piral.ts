import { resolve } from 'path';
import { setStandardEnvs } from '../common';
import type { BundleHandlerResponse, LogLevels, PiralBuildHandler } from '../types';

let handler: PiralBuildHandler;
let bundler: BundleHandlerResponse;

function run(
  root: string,
  outFile: string,
  outDir: string,
  piral: string,
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
    piral,
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
          msg.outFile,
          dist,
          msg.piral,
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
