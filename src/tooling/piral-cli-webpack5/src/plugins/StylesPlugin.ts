import { posix, resolve } from 'path';
import { Compilation } from 'webpack';
import { RawSource } from 'webpack-sources';

export default class StylesPlugin {
  constructor(private cssName: string, private entryName: string) {}

  apply(compiler) {
    const { entry } = compiler.options;

    const entries = entry[this.entryName].import.map((e: string) => e.split('\\').join(posix.sep));
    const query = `cssName=${this.cssName}&entries=${entries.join(',')}!`;
    const setPath = resolve(__dirname, '..', 'set-path');
    const loaderBasePath = resolve(__dirname, `StylesLoader`);
    const loaderPath = `${loaderBasePath}?${query}`;

    entry[this.entryName].import = [setPath, loaderPath];

    compiler.hooks.compilation.tap('StylesPlugin', (compilation: Compilation) => {
      if (!compilation.compiler.parentCompilation) {
        compilation.hooks.processAssets.tap(
          {
            name: 'StylesPlugin',
            stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
          },
          (assets) => {
            if (!assets[this.cssName]) {
              const source = new RawSource('');
              compilation.emitAsset(this.cssName, source);
            }
          },
        );
      }
    });
  }
}
