import { transformSync } from '@babel/core';
import { SyncTransformer } from '@jest/transform';

const codegen: SyncTransformer = {
  process(_: string, filename: string) {
    const factory = require(filename);
    const result = factory.call({
      outDir: global.process.cwd(),
      rootDir: global.process.cwd(),
    });
    const { code } = transformSync(result, {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: 'commonjs',
          },
        ],
      ],
    });
    return { code };
  },
  getCacheKey(_: string, filename: string) {
    // let's never cache
    const rnd = Math.random().toString();
    return `${filename}?_=${rnd}`;
  },
};

export default codegen;
