import { extendBundler, modifyBundler, postProcess } from './pilet';

jest.mock('fs', () => ({
  readFile(name: string, enc: string, cb: Function) {
    cb(undefined, readContent);
  },
  writeFile(name: string, content: string, enc: string, cb: Function) {
    writeContent = content;
    cb(undefined);
  },
}));

let readContent = '';
let writeContent = '';

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
    expect(Parser.prototype.generate).toBeUndefined();
    extendBundler(bundler);
    expect(bundler.parser.registerExtension).toHaveBeenCalled();
    expect(bundler.packagers.add).toHaveBeenCalled();
    expect(Parser.prototype.generate).not.toBeUndefined();
  });

  it('modifyBundler should create getLoadedAsset prototype function', () => {
    const Bundler = function() {};
    expect(Bundler.prototype.getLoadedAsset).toBeUndefined();
    modifyBundler(Bundler.prototype, [], '');
    expect(Bundler.prototype.getLoadedAsset).not.toBeUndefined();
  });

  it('postProcess should not change the content if not JS', async () => {
    readContent = 'no-js';
    await postProcess({
      getHash() {
        return 'abcdef';
      },
      type: '',
      name: '',
      childBundles: [],
    } as any);
    expect(writeContent).toBe(readContent);
  });
});
