import { resolve } from 'path';
import { Compilation } from 'webpack';
import { RawSource } from 'webpack-sources';

export default class SheetPlugin {
  private loaderPath: string;

  constructor(private cssName: string, piletName: string, private entryName: string) {
    this.loaderPath = resolve(__dirname, `SheetLoader?cssName=${cssName}&piletName=${piletName}!`);
  }

  apply(compiler) {
    const { entry } = compiler.options;

    entry[this.entryName].import = [this.loaderPath, ...entry[this.entryName].import];

    compiler.hooks.compilation.tap('SheetPlugin', (compilation: Compilation) => {
      if (!compilation.compiler.parentCompilation) {
        compilation.hooks.processAssets.tap(
          {
            name: 'SheetPlugin',
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
