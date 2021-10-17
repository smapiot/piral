import type { LogLevels, PiralBuildHandler } from '../types';
import { setStandardEnvs, progress, logReset } from '../common';
import { resolve } from 'path';

let handler: PiralBuildHandler;

function run(
  root: string,
  outDir: string,
  piral: string,
  hmr: boolean,
  externals: Array<string>,
  entryFiles: string,
  logLevel: LogLevels,
) {
  progress(`Preparing supplied Piral instance ...`);

  setStandardEnvs({
    piral,
    dependencies: externals,
    production: false,
    debugPiral: true,
    debugPilet: true,
    root,
  });

  return handler.create({
    root,
    entryFiles,
    outDir,
    externals,
    emulator: true,
    sourceMaps: true,
    contentHash: false,
    minify: false,
    publicUrl: undefined,
    hmr,
    logLevel,
    watch: true,
  });
}

process.on('message', async (msg) => {
  try {
    switch (msg.type) {
      case 'init':
        handler = require(msg.path);
        break;
      case 'start':
        const root = process.cwd();
        const outDir = resolve(root, 'dist', 'app');
        const bundler = await run(root, outDir, msg.piral, true, msg.externals, msg.entryFiles, msg.logLevel);
        const result = await bundler.bundle();

        logReset();

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
