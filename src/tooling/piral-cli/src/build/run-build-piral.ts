import type { PiralBuildHandler, LogLevels } from '../types';
import { setStandardEnvs } from '../common';

let handler: PiralBuildHandler;

function run(
  root: string,
  piral: string,
  emulator: boolean,
  sourceMaps: boolean,
  contentHash: boolean,
  minify: boolean,
  externals: Array<string>,
  publicUrl: string,
  outDir: string,
  entryFiles: string,
  logLevel: LogLevels,
) {
  setStandardEnvs({
    production: !emulator,
    root,
    debugPiral: emulator,
    debugPilet: emulator,
    piral,
    dependencies: externals,
  });

  return handler.create({
    root,
    entryFiles,
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
          msg.sourceMaps,
          msg.contentHash,
          msg.minify,
          msg.externals,
          msg.publicUrl,
          msg.outDir,
          msg.entryFiles,
          msg.logLevel,
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
