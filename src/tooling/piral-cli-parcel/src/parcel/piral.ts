import type { PiralBuildHandler } from 'piral-cli';

const handler: PiralBuildHandler = {
  create(config) {
    const bundler = setupBundler({
      type: 'piral',
      entryFiles,
      config: {
        cacheDir,
        watch: false,
        sourceMaps,
        contentHash,
        minify,
        scopeHoist,
        detailedReport,
        publicUrl,
        logLevel,
        outDir,
        outFile,
      },
    });
  
    const bundle = await bundler.bundle();
  },
};

export const create = handler.create;
