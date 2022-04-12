import { setStandardEnvs } from '../common';
import type { PiralBuildHandler, LogLevels } from '../types';

let handler: PiralBuildHandler;

function run(
  root: string,
  piral: string,
  emulator: boolean,
  standalone: boolean,
  sourceMaps: boolean,
  contentHash: boolean,
  minify: boolean,
  externals: Array<string>,
  publicUrl: string,
  outFile: string,
  outDir: string,
  entryFiles: string,
  logLevel: LogLevels,
  args: any,
) {
  setStandardEnvs({
    production: !emulator,
    root,
    publicPath: publicUrl,
    debugPiral: emulator,
    debugPilet: emulator || standalone,
    piral,
    dependencies: externals,
  });

  return handler.create({
    root,
    entryFiles,
    outFile,
    outDir,
    externals,
    emulator,
    sourceMaps,
    contentHash,
    minify,
    publicUrl,
    hmr: false,
    logLevel,
    watch: false,
    args,
  });
}

process.on('message', async (msg) => {
  try {
    switch (msg.type) {
      case 'init':
        handler = require(msg.path);
        break;
      case 'start':
        const bundler = await run(
          process.cwd(),
          msg.piral,
          msg.emulator,
          msg.standalone,
          msg.sourceMaps,
          msg.contentHash,
          msg.minify,
          msg.externals,
          msg.publicUrl,
          msg.outFile,
          msg.outDir,
          msg.entryFiles,
          msg.logLevel,
          msg,
        );
        const result = await bundler.bundle();

        if (result) {
          process.send({
            type: 'done',
            outDir: result.outDir,
            outFile: result.outFile,
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
