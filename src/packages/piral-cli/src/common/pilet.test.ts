import { extendBundlerForPilet, modifyBundlerForPilet, postProcess } from './pilet';

jest.mock('fs', () => ({
  readFile(name: string, enc: string, cb: Function) {
    cb(undefined, readContent);
  },
  writeFile(name: string, content: string, enc: string, cb: Function) {
    writeContent = content;
    cb(undefined);
  },
}));

jest.mock('parcel-bundler', () => ({}));
jest.mock('./VirtualPackager', () => ({}));
jest.mock('./VirtualAsset', () => ({}));

let readContent = '';
let writeContent: string = undefined;

describe('Pilet Build Module', () => {
  it('extendBundler should create generate prototype function', () => {
    const Parser = function() {};
    const Bundler = function() {
      this.parser = {
        findParser() {
          return Parser;
        },
        registerExtension: jest.fn(),
      };
      this.packagers = {
        add: jest.fn(),
      };
    };
    const bundler = new Bundler();
    extendBundlerForPilet(bundler);
    expect(bundler.parser.registerExtension).toHaveBeenCalled();
    expect(bundler.packagers.add).toHaveBeenCalled();
  });

  it('modifyBundler should create getLoadedAsset prototype function', () => {
    const Bundler = function() {};
    expect(Bundler.prototype.getLoadedAsset).toBeUndefined();
    modifyBundlerForPilet(Bundler.prototype, [], '');
    expect(Bundler.prototype.getLoadedAsset).not.toBeUndefined();
  });

  it('postProcess should not write out the content if not JS', async () => {
    readContent = 'no-js';
    await postProcess({
      getHash() {
        return 'abcdef';
      },
      type: '',
      name: '',
      childBundles: [],
    } as any);
    expect(writeContent).toBeUndefined();
  });

  it('postProcess should write out the content if CSS', async () => {
    readContent = 'no-js';
    await postProcess({
      getHash() {
        return 'abcdef';
      },
      type: 'css',
      name: '',
      childBundles: [],
    } as any);
    expect(writeContent).toBe('no-js');
  });

  it('postProcess should change the content if JS', async () => {
    readContent = 'no-js';
    await postProcess({
      getHash() {
        return 'abcdef';
      },
      type: 'js',
      name: '',
      childBundles: [],
    } as any);
    expect(writeContent)
      .toBe(`!(function(global,parcelRequire){'use strict';var __bundleUrl__=function(){try{throw new Error}catch(t){const e=(\"\"+t.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\\/\\/[^)\\n]+/g);if(e)return e[0].replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\\/\\/.+)\\/[^\\/]+$/,\"$1\")+\"/\"}return\"/\"}();
no-js
;global.pr_abcdef=parcelRequire}(window, window.pr_abcdef));`);
  });
});
