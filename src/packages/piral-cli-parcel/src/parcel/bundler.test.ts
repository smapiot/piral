import { postProcess } from './bundler';

jest.mock('fs', () => ({
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

jest.mock('parcel-bundler', () => ({}));

let readContent = '';
let writeContent: string = undefined;

describe('Pilet Build Module', () => {
  it('postProcess should not write out the content if not JS', async () => {
    readContent = 'no-js';
    await postProcess(
      {
        getHash() {
          return 'abcdef';
        },
        type: '',
        name: '',
        childBundles: [],
      } as any,
      'v0',
    );
    expect(writeContent).toBeUndefined();
  });

  it('postProcess should not change the content if CSS', async () => {
    readContent = 'no-js';
    await postProcess(
      {
        getHash() {
          return 'abcdef';
        },
        type: 'css',
        name: '',
        childBundles: [],
      } as any,
      'v0',
    );
    expect(writeContent).toBeUndefined();
  });

  it('postProcess should change the content if JS v:0', async () => {
    readContent = 'no-js';
    await postProcess(
      {
        getHash() {
          return 'abcdef';
        },
        type: 'js',
        name: '',
        childBundles: [],
      } as any,
      'v0',
    );
    expect(writeContent)
      .toBe(`//@pilet v:0\n!(function(global,parcelRequire){'use strict';var __bundleUrl__=function(){try{throw new Error}catch(t){const e=(\"\"+t.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\\/\\/[^)\\n]+/g);if(e)return e[0].replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\\/\\/.+)\\/[^\\/]+$/,\"$1\")+\"/\"}return\"/\"}();
no-js
;global.pr_abcdef=parcelRequire}(window, window.pr_abcdef));`);
  });

  it('postProcess should change the content if JS without header if not parent v:0', async () => {
    readContent = 'no-js';
    await postProcess(
      {
        getHash() {
          return 'abcdef';
        },
        type: 'js',
        name: '',
        childBundles: [
          {
            getHash() {
              return 'abcdef';
            },
            type: 'js',
            name: '',
            childBundles: [],
          },
        ],
      } as any,
      'v0',
    );
    expect(writeContent)
      .toBe(`!(function(global,parcelRequire){'use strict';var __bundleUrl__=function(){try{throw new Error}catch(t){const e=(\"\"+t.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\\/\\/[^)\\n]+/g);if(e)return e[0].replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\\/\\/.+)\\/[^\\/]+$/,\"$1\")+\"/\"}return\"/\"}();
no-js
;global.pr_abcdef=parcelRequire}(window, window.pr_abcdef));`);
  });

  it('postProcess should change the content if JS v:1', async () => {
    readContent = 'no-js';
    await postProcess(
      {
        getHash() {
          return 'abcdef';
        },
        type: 'js',
        name: '',
        childBundles: [],
      } as any,
      'v1',
    );
    expect(writeContent)
      .toBe(`//@pilet v:1(pr_abcdef)\n!(function(global,parcelRequire){'use strict';var __bundleUrl__=function(){try{throw new Error}catch(t){const e=(\"\"+t.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\\/\\/[^)\\n]+/g);if(e)return e[0].replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\\/\\/.+)\\/[^\\/]+$/,\"$1\")+\"/\"}return\"/\"}();function define(getExports){(typeof document!=='undefined')&&(document.currentScript.app=getExports())};define.amd=true;
no-js
;global.pr_abcdef=parcelRequire}(window, window.pr_abcdef));`);
  });

  it('postProcess should change the content if JS without header if not parent v:1', async () => {
    readContent = 'no-js';
    await postProcess(
      {
        getHash() {
          return 'abcdef';
        },
        type: 'js',
        name: '',
        childBundles: [
          {
            getHash() {
              return 'abcdef';
            },
            type: 'js',
            name: '',
            childBundles: [],
          },
        ],
      } as any,
      'v1',
    );
    expect(writeContent)
      .toBe(`!(function(global,parcelRequire){'use strict';var __bundleUrl__=function(){try{throw new Error}catch(t){const e=(\"\"+t.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\\/\\/[^)\\n]+/g);if(e)return e[0].replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\\/\\/.+)\\/[^\\/]+$/,\"$1\")+\"/\"}return\"/\"}();
no-js
;global.pr_abcdef=parcelRequire}(window, window.pr_abcdef));`);
  });
});
