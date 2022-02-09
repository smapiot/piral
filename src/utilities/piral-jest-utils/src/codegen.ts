import { transformSync } from '@babel/core';

export function process(_: string, filename: string) {
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
  return code;
}

export function getCacheKey(_: string, filename: string) {
  // let's never cache
  const rnd = Math.random().toString();
  return `${filename}?_=${rnd}`;
}
