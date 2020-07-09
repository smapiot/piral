import * as webpack from 'webpack';
import { resolve, basename, dirname } from 'path';
import { EventEmitter } from 'events';

interface BuildResult {
  outFile: string;
  outDir: string;
}

function getOutput(stats: webpack.Stats) {
  const { outputPath, entrypoints } = stats.toJson();
  const assets = entrypoints.main.assets;
  return resolve(outputPath, assets[0]);
}

export function runWebpack(wpConfig: webpack.Configuration) {
  const eventEmitter = new EventEmitter();
  const outDir = wpConfig.output.path;
  const mainBundle = {
    name: '',
    requireRef: undefined,
    entryAsset: {
      hash: '',
    },
  };

  wpConfig.plugins.push({
    apply(compiler) {
      compiler.hooks.beforeCompile.tap('piral-cli', () => {
        eventEmitter.emit('buildStart');
      });

      compiler.hooks.done.tap('piral-cli', stats => {
        mainBundle.name = getOutput(stats);
        mainBundle.requireRef = stats.compilation.outputOptions?.jsonpFunction?.replace('_chunks', '');
        mainBundle.entryAsset.hash = stats.hash;
        eventEmitter.emit('bundled');
      });
    },
  });

  const bundle = () =>
    new Promise<BuildResult>((resolve, reject) => {
      webpack(wpConfig, (err, stats) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(
            stats.toString({
              chunks: false,
              colors: true,
              usedExports: true,
            }),
          );

          if (stats.hasErrors()) {
            reject(stats.toJson());
          } else {
            const file = getOutput(stats);
            resolve({
              outFile: `/${basename(file)}`,
              outDir: dirname(file),
            });
          }
        }
      });
    });

  return {
    bundle,
    on(ev: string, listener: () => void) {
      eventEmitter.on(ev, listener);
    },
    off(ev: string, listener: () => void) {
      eventEmitter.off(ev, listener);
    },
    options: {
      outDir,
    },
    mainBundle,
  };
}
