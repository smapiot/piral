import type { PiletBuildHandler } from 'piral-cli';

const handler: PiletBuildHandler = {
  create(config) {
    const bundler = setupBundler({
      type: 'pilet',
      externals,
      importmap,
      targetDir,
      entryModule,
      config: {
        outFile,
        outDir,
        cacheDir,
        watch: false,
        sourceMaps,
        minify,
        scopeHoist,
        contentHash,
        publicUrl: './',
        detailedReport,
        logLevel,
      },
    });
  
    const name = process.env.BUILD_PCKG_NAME;
    const bundle = await bundler.bundle();
    await postProcess(bundle, name, version, minify, importmap);
  },
};

export const create = handler.create;
