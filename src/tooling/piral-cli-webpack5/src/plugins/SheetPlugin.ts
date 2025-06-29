import { resolve } from 'path';
import { Compilation, Compiler } from 'webpack';
import { CachedSource, ConcatSource, ReplaceSource } from 'webpack-sources';

export default class SheetPlugin {
  private loaderPath: string;

  constructor(
    private cssName: string,
    piletName: string,
    private entryName: string,
  ) {
    this.loaderPath = resolve(__dirname, `SheetLoader?cssName=${cssName}&piletName=${piletName}!`);
  }

  apply(compiler: Compiler) {
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
              const name = JSON.stringify(this.cssName);
              const [[, source]] = Object.entries(assets);

              if (source instanceof CachedSource) {
                const cs = source.original();

                if (cs instanceof ConcatSource && cs.children) {
                  cs.children = cs.children.filter((m) => {
                    if (m instanceof CachedSource) {
                      const original = m.original();

                      if (original instanceof ReplaceSource) {
                        const src = original.source();

                        if (typeof src === 'string') {
                          return !src.includes(name);
                        }
                      }
                    }

                    return true;
                  });
                }
              }
            }
          },
        );
      }
    });
  }
}
