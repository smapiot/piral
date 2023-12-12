import { setStandardEnvs } from '../common/envs';
import type { PiralBuildHandler, LogLevels } from '../types';

let handler: PiralBuildHandler;

function run(
  root: string,
  piralInstances: Array<string>,
  emulator: boolean,
  standalone: boolean,
  sourceMaps: boolean,
  watch: boolean,
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
    piralInstances,
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
    watch,
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
        const bundler = await run(
          process.cwd(),
          msg.piralInstances,
          msg.emulator,
          msg.standalone,
          msg.sourceMaps,
          msg.watch,
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

        if (result && !msg.watch) {
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
