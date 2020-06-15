import * as webpack from 'webpack';
import { EventEmitter } from 'events';

interface BuildResult {
  outFile: string;
  outDir: string;
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

  const bundle = () => new Promise<BuildResult>((resolve, reject) => {
    const compiler = webpack(wpConfig, (err, stats) => {
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
            outFile: stats.compilation.outputPath.replace(outDir, ''),
            outDir,
          });
        }
      }
    }) as webpack.Compiler;

    compiler.hooks.beforeCompile.tap('piral-cli', () => {
      eventEmitter.emit('buildStart');
    });

    compiler.hooks.done.tap('piral-cli', stats => {
      mainBundle.name = stats.compilation.outputPath.replace(outDir, '');
      mainBundle.entryAsset.hash = stats.hash;
      eventEmitter.emit('bundled');
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
