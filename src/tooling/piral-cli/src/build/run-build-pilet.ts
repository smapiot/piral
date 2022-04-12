import { setStandardEnvs } from '../common';
import type { PiletSchemaVersion, LogLevels, SharedDependency, PiletBuildHandler } from '../types';

let handler: PiletBuildHandler;

function run(
  root: string,
  piral: string,
  sourceMaps: boolean,
  contentHash: boolean,
  minify: boolean,
  externals: Array<string>,
  importmap: Array<SharedDependency>,
  targetDir: string,
  outDir: string,
  outFile: string,
  entryModule: string,
  version: PiletSchemaVersion,
  logLevel: LogLevels,
  args: any,
) {
  setStandardEnvs({
    production: true,
    piral,
    root,
  });

  return handler.create({
    root,
    piral,
    entryModule,
    targetDir,
    outDir,
    outFile,
    externals,
    importmap,
    version,
    develop: false,
    sourceMaps,
    contentHash,
    minify,
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
          msg.sourceMaps,
          msg.contentHash,
          msg.minify,
          msg.externals,
          msg.importmap,
          msg.targetDir,
          msg.outDir,
          msg.outFile,
          msg.entryModule,
          msg.version,
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
