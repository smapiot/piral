import { extendBundlerForPilet, modifyBundlerForPilet } from './pilet';

jest.mock('./VirtualPackager', () => ({}));
jest.mock('./VirtualAsset', () => ({}));

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
});
