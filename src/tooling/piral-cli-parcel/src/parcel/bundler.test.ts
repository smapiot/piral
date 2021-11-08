import { postProcess } from './bundler';

jest.mock('fs', () => ({
  realpathSync: () => ({}),
  readFile(_name: string, _enc: string, cb: Function) {
    cb(undefined, readContent);
  },
  readFileSync() {
    return '';
  },
  writeFile(_name: string, content: string, _enc: string, cb: Function) {
    writeContent = content;
    cb(undefined);
  },
}));

jest.mock('piral-cli/lib/external', () => ({
  rc() {},
  logger: {
    stopSpinner() {},
    verbose() {},
    info() {},
    error() {},
    log() {},
    setOptions() {},
  },
}));

jest.mock('parcel-bundler', () => ({}));

let readContent = '';
let writeContent: string = undefined;

describe('Pilet Build Module', () => {
  it('postProcess should not write out the content if not JS', async () => {
    readContent = 'no-js';
    await postProcess(
      {
        type: '',
        name: '',
        childBundles: [],
      } as any,
      'my-pilet',
      'v0',
      false,
      [],
    );
    expect(writeContent).toBeUndefined();
  });

  it('postProcess should not change the content if CSS', async () => {
    readContent = 'no-js';
    await postProcess(
      {
        type: 'css',
        name: '',
        childBundles: [],
      } as any,
      'my-pilet',
      'v0',
      false,
      [],
    );
    expect(writeContent).toBeUndefined();
  });

  it('postProcess should change the content if JS v:0', async () => {
    readContent = 'no-js';
    await postProcess(
      {
        type: 'js',
        name: '',
        childBundles: [],
      } as any,
      'my-pilet',
      'v0',
      false,
      [],
    );
    expect(writeContent)
      .toBe(`//@pilet v:0\n!(function(global,parcelRequire){'use strict';var __bundleUrl__=function(){try{throw new Error}catch(t){const e=(\"\"+t.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\\/\\/[^)\\n]+/g);if(e)return e[0].replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\\/\\/.+)\\/[^\\/]+$/,\"$1\")+\"/\"}return\"/\"}();
no-js
;global.parcelChunkpr_mypilet=parcelRequire}(window, window.parcelChunkpr_mypilet));`);
  });

  it('postProcess should change the content if JS without header if not parent v:0', async () => {
    readContent = 'no-js';
    await postProcess(
      {
        type: 'js',
        name: '',
        childBundles: [
          {
            type: 'js',
            name: '',
            childBundles: [],
          },
        ],
      } as any,
      'my-pilet',
      'v0',
      false,
      [],
    );
    expect(writeContent)
      .toBe(`!(function(global,parcelRequire){'use strict';var __bundleUrl__=function(){try{throw new Error}catch(t){const e=(\"\"+t.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\\/\\/[^)\\n]+/g);if(e)return e[0].replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\\/\\/.+)\\/[^\\/]+$/,\"$1\")+\"/\"}return\"/\"}();
no-js
;global.parcelChunkpr_mypilet=parcelRequire}(window, window.parcelChunkpr_mypilet));`);
  });

  it('postProcess should change the content if JS v:1', async () => {
    readContent = 'no-js';
    await postProcess(
      {
        type: 'js',
        name: '',
        childBundles: [],
      } as any,
      'my-pilet',
      'v1',
      false,
      [],
    );
    expect(writeContent)
      .toBe(`//@pilet v:1(parcelChunkpr_mypilet)\n!(function(global,parcelRequire){'use strict';var __bundleUrl__=function(){try{throw new Error}catch(t){const e=(\"\"+t.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\\/\\/[^)\\n]+/g);if(e)return e[0].replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\\/\\/.+)\\/[^\\/]+$/,\"$1\")+\"/\"}return\"/\"}();function define(getExports){(typeof document!=='undefined')&&(document.currentScript.app=getExports())};define.amd=true;
no-js
;global.parcelChunkpr_mypilet=parcelRequire}(window, window.parcelChunkpr_mypilet));`);
  });

  it('postProcess should change the content if JS without header if not parent v:1', async () => {
    readContent = 'no-js';
    await postProcess(
      {
        type: 'js',
        name: '',
        childBundles: [
          {
            type: 'js',
            name: '',
            childBundles: [],
          },
        ],
      } as any,
      'my-pilet',
      'v1',
      false,
      [],
    );
    expect(writeContent)
      .toBe(`!(function(global,parcelRequire){'use strict';var __bundleUrl__=function(){try{throw new Error}catch(t){const e=(\"\"+t.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\\/\\/[^)\\n]+/g);if(e)return e[0].replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\\/\\/.+)\\/[^\\/]+$/,\"$1\")+\"/\"}return\"/\"}();
no-js
;global.parcelChunkpr_mypilet=parcelRequire}(window, window.parcelChunkpr_mypilet));`);
  });
});
