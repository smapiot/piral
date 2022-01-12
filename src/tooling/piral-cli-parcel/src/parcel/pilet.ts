import type { PiletBuildHandler } from 'piral-cli';
import { postProcess, setupBundler } from './bundler';
import { runParcel } from './bundler-run';

const handler: PiletBuildHandler = {
  create(options) {
    const bundler = setupBundler({
      type: 'pilet',
      externals: options.externals,
      importmap: options.importmap,
      targetDir: options.targetDir,
      entryModule: options.entryModule,
      config: {
        outFile: options.outFile,
        outDir: options.outDir,
        cacheDir: options.args.cacheDir,
        watch: options.watch,
        hmr: false,
        sourceMaps: options.sourceMaps,
        minify: options.minify,
        scopeHoist: options.args.scopeHoist,
        contentHash: !options.watch && options.contentHash,
        publicUrl: './',
        detailedReport: options.args.detailedReport,
        logLevel: options.logLevel,
        autoInstall: options.args.autoInstall,
      },
    });

    return runParcel(bundler, (bundle) => {
      const name = process.env.BUILD_PCKG_NAME;
      return postProcess(bundle, name, options.version, options.minify, options.importmap);
    });
  },
};

export const create = handler.create;
