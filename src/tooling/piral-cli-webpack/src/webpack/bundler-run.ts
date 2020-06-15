import * as webpack from 'webpack';
import { EventEmitter } from 'events';

interface BuildResult {
  outFile: string;
  outDir: string;
}

function getOutput(assets: Record<string, any>) {
  return Object.keys(assets)
    .filter(m => assets[m].emitted)
    .map(m => `/${m}`)[0];
}

export function runWebpack(wpConfig: webpack.Configuration) {
  const eventEmitter = new EventEmitter();
  const outDir = wpConfig.output.path;
  const mainBundle = {
    name: '',
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
        mainBundle.name = outDir + getOutput(stats.compilation.assets);
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
            resolve({
              outFile: getOutput(stats.compilation.assets),
              outDir,
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
