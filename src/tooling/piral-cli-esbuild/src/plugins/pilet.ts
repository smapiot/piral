import type { SharedDependency } from 'piral-cli';
import { Plugin } from 'esbuild';
import { transformFileAsync } from '@babel/core';
import { promises } from 'fs';
import { isAbsolute, join, resolve, basename } from 'path';
import { getPackageName, getRequireRef } from '../shared';

export interface PiletPluginOptions {
  importmap: Array<SharedDependency>;
}

export const piletPlugin = (options: PiletPluginOptions): Plugin => ({
  name: 'pilet-plugin',
  setup(build) {
    const loaders = build.initialOptions.loader || {};
    const extensions = [];

    for (const ext of Object.keys(loaders)) {
      const loader = loaders[ext];

      if (loader === 'file') {
        extensions.push(ext);
        delete loaders[ext];
      }
    }

    build.initialOptions.metafile = true;
    const filter = new RegExp(`(${extensions.map((ext) => `\\${ext}`).join('|')})$`);

    build.onResolve({ filter }, (args) => {
      if (args.namespace === 'ref-stub') {
        return {
          path: args.path,
          namespace: 'ref-binary',
        };
      } else if (args.resolveDir !== '') {
        return {
          path: isAbsolute(args.path) ? args.path : join(args.resolveDir, args.path),
          namespace: 'ref-stub',
        };
      } else {
        return; // Ignore unresolvable paths
      }
    });

    build.onLoad({ filter: /.*/, namespace: 'ref-stub' }, async (args) => ({
      resolveDir: resolve(__dirname),
      contents: [
        `import path from ${JSON.stringify(args.path)}`,
        `import { __bundleUrl__ } from ${JSON.stringify('../../set-path.js')}`,
        `export default __bundleUrl__ + path;`,
      ].join('\n'),
    }));

    build.onLoad({ filter: /.*/, namespace: 'ref-binary' }, async (args) => ({
      contents: await promises.readFile(args.path),
      loader: 'file',
    }));

    build.onEnd(async (result) => {
      const root = process.cwd();

      if (result.metafile) {
        const { outputs } = result.metafile;
        const { entryPoints } = build.initialOptions;
        const [name] = Object.keys(entryPoints);
        const entryModule = resolve(root, entryPoints[name]);
        const cssFiles = Object.keys(outputs)
          .filter((m) => m.endsWith('.css'))
          .map((m) => basename(m));

        await Promise.all(
          Object.keys(outputs)
            .filter((m) => m.endsWith('.js'))
            .map(async (file) => {
              const { entryPoint } = outputs[file];
              const isEntryModule = entryPoint && resolve(root, entryPoint) === entryModule;
              const path = resolve(root, file);
              const smname = `${file}.map`;
              const smpath = resolve(root, smname);
              const sourceMaps = smname in outputs;
              const inputSourceMap = sourceMaps ? JSON.parse(await promises.readFile(smpath, 'utf8')) : undefined;
              const plugins: Array<any> = [
                [
                  require.resolve('./importmap-plugin'),
                  {
                    importmap: options.importmap,
                  },
                ],
              ];

              if (isEntryModule) {
                plugins.push([
                  require.resolve('./banner-plugin'),
                  {
                    name: getPackageName(),
                    importmap: options.importmap,
                    requireRef: getRequireRef(),
                    cssFiles,
                  },
                ]);
              }

              const { code, map } = await transformFileAsync(path, {
                sourceMaps,
                inputSourceMap,
                comments: isEntryModule,
                plugins,
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      modules: 'systemjs',
                    },
                  ],
                ],
              });

              if (map) {
                await promises.writeFile(smpath, JSON.stringify(map), 'utf8');
              }

              await promises.writeFile(path, code, 'utf8');
            }),
        );
      }
    });
  },
});
