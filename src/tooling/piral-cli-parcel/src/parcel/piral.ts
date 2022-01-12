import type { PiralBuildHandler } from 'piral-cli';
import { setupBundler } from './bundler';
import { runParcel } from './bundler-run';

const handler: PiralBuildHandler = {
  create(options) {
    const bundler = setupBundler({
      type: 'piral',
      entryFiles: options.entryFiles,
      config: {
        cacheDir: options.args.cacheDir,
        watch: options.watch,
        sourceMaps: options.sourceMaps,
        contentHash: !options.watch && options.contentHash,
        minify: options.minify,
        scopeHoist: options.args.scopeHoist,
        detailedReport: options.args.detailedReport,
        publicUrl: options.publicUrl,
        logLevel: options.logLevel,
        outDir: options.outDir,
        outFile: options.outFile,
        hmr: options.hmr,
        autoInstall: options.args.autoInstall,
      },
    });

    return runParcel(bundler, () => Promise.resolve(''));
  },
};

export const create = handler.create;
