import { resolve } from 'path';
import { setStandardEnvs } from '../common/envs';
import type { LogLevels, PiralBuildHandler } from '../types';

let handler: PiralBuildHandler;

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
    piralInstances,
    dependencies: externals,
    publicPath: publicUrl,
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
    publicUrl,
    hmr,
    logLevel,
    watch: true,
    args,
  });
}

process.on('message', async (msg: any) => {
  try {
    switch (msg.type) {
      case 'init':
        handler = require(msg.path);
        break;
      case 'start':
        const root = process.cwd();
        const outDir = resolve(root, 'dist');
        const bundler = await run(
          root,
          msg.outFile,
          outDir,
          msg.piralInstances,
          true,
          msg.externals,
          msg.publicUrl,
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
