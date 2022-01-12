import { postProcess, setupBundler } from './bundler';
import { runParcel } from './bundler-run';

process.on('message', async (msg) => {
  try {
    if (msg.type === 'start') {
      const bundler = setupBundler({
        type: 'dependency',
        externals: msg.externals,
        importmap: msg.importmap,
        targetDir: msg.targetDir,
        entryModule: msg.entryModule,
        config: {
          outFile: msg.outFile,
          outDir: msg.outDir,
          cacheDir: msg.cacheDir,
          watch: false,
          sourceMaps: msg.sourceMaps,
          minify: msg.minify,
          scopeHoist: false,
          contentHash: false,
          detailedReport: false,
          publicUrl: './',
          logLevel: msg.logLevel,
        },
      });

      const handler = await runParcel(bundler, (bundle) => {
        return postProcess(bundle, msg.name, msg.version, true, msg.importmap, true);
      });

      await handler.bundle();

      process.send({
        type: 'done',
      });
    }
  } catch (error) {
    process.send({
      type: 'fail',
      error: error?.message,
    });
  }
});
