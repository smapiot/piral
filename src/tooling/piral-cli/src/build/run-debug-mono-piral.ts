import { resolve } from 'path';
import { setStandardEnvs, progress, logReset } from '../common';
import type { LogLevels, PiralBuildHandler } from '../types';

let handler: PiralBuildHandler;

function run(
  root: string,
  outFile: string,
  outDir: string,
  piral: string,
  hmr: boolean,
  externals: Array<string>,
  entryFiles: string,
  logLevel: LogLevels,
  args: any,
) {
  progress(`Preparing supplied Piral instance ...`);

  setStandardEnvs({
    piral,
    dependencies: externals,
    publicPath: '/',
    production: false,
    debugPiral: true,
    debugPilet: true,
    root,
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
    publicUrl: '/',
    hmr,
    logLevel,
    watch: true,
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
        const root = process.cwd();
        const outDir = resolve(root, 'dist', 'app');
        const bundler = await run(
          root,
          msg.outFile,
          outDir,
          msg.piral,
          true,
          msg.externals,
          msg.entryFiles,
          msg.logLevel,
          msg,
        );
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
