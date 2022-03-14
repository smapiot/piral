import InjectPlugin from 'webpack-inject-plugin';
import { RawSource } from 'webpack-sources';

function sheetLoader(cssName: string, name: string) {
  return () => {
    const debug = process.env.NODE_ENV === 'development';
    return [
      `var d=document`,
      `var u=__webpack_public_path__+${JSON.stringify(cssName)}`,
      `var e=d.createElement("link")`,
      `e.setAttribute('data-origin', ${JSON.stringify(name)})`,
      `e.type="text/css"`,
      `e.rel="stylesheet"`,
      `e.href=${debug ? 'u+"?_="+Math.random()' : 'u'}`,
      `d.head.appendChild(e)`,
    ].join(';');
  };
}

export default class SheetPlugin extends InjectPlugin {
  constructor(private cssName: string, name: string, entryName: string) {
    super(sheetLoader(cssName, name), {
      entryName,
    });
  }

  apply(compiler) {
    super.apply(compiler);

    compiler.hooks.compilation.tap('SheetPlugin', (compilation) => {
      if (!compilation.compiler.parentCompilation) {
        compilation.hooks.afterOptimizeAssets.tap('SheetPlugin', (assets) => {
          if (!assets[this.cssName]) {
            const source = new RawSource('');
            compilation.emitAsset(this.cssName, source);
          }
        });
      }
    });
  }
}
