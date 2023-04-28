import { resolve } from 'path';
import { Compilation } from 'webpack';
import { RawSource } from 'webpack-sources';

export default class StylesPlugin {
  constructor(private cssName: string, private entryName: string) {}

  apply(compiler) {
    const { entry } = compiler.options;

    const entries = entry[this.entryName].import;
    const query = `cssName=${this.cssName}&entries=${entries.join(',')}!`;
    const setPath = resolve(__dirname, '..', 'set-path');
    const loaderPath = resolve(__dirname, `StylesLoader?${query}`);

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
