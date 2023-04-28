import { resolve } from 'path';
import { Compilation } from 'webpack';
import { RawSource } from 'webpack-sources';

export default class StylesPlugin {
  private loaderPath: string;

  constructor(private cssName: string, private entryName: string) {
    this.loaderPath = resolve(__dirname, `StylesLoader?cssName=${cssName}!`);
  }

  apply(compiler) {
    const { entry } = compiler.options;

    entry[this.entryName].import = [this.loaderPath, ...entry[this.entryName].import];

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
