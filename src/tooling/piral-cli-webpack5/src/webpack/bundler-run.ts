import * as webpack from 'webpack';
import { resolve, basename, dirname } from 'path';
import { EventEmitter } from 'events';
import type { LogLevels } from 'piral-cli';

interface BuildResult {
  outFile: string;
  outDir: string;
}

function getOutput(stats: webpack.Stats) {
  const { outputPath, entrypoints } = stats.toJson();
  const assets = entrypoints.main.assets;
  return resolve(outputPath, assets[0].name);
}

function getPreset(logLevel: LogLevels) {
  switch (logLevel) {
    case 0: //LogLevels.disabled
      return 'none';
    case 1: //LogLevels.error
      return 'errors-only';
    case 2: //LogLevels.warning
      return 'errors-warnings';
    case 4: //LogLevels.verbose
    case 5: //LogLevels.debug
      return 'verbose';
    case 3: //LogLevels.info
    default:
      return 'normal';
  }
}

export function runWebpack(wpConfig: webpack.Configuration, logLevel: LogLevels) {
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
    apply(compiler: webpack.Compiler) {
      compiler.hooks.beforeCompile.tap('piral-cli', () => {
        eventEmitter.emit('buildStart');
      });

      compiler.hooks.done.tap('piral-cli', (stats) => {
        mainBundle.name = getOutput(stats);
        mainBundle.requireRef = stats.compilation.outputOptions?.uniqueName;
        mainBundle.entryAsset.hash = stats.hash;
        eventEmitter.emit('bundled');
      });
    },
  });

  const bundle = () =>
    new Promise<BuildResult>((resolve, reject) => {
      const preset = {
        current: undefined,
      };

      const process = webpack(wpConfig, (err, stats) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(
            stats.toString({
              ...preset.current,
              colors: true,
            }),
          );

          if (stats.hasErrors()) {
            reject(stats.toJson(preset.current));
          } else {
            const file = getOutput(stats);
            resolve({
              outFile: `/${basename(file)}`,
              outDir: dirname(file),
            });
          }
        }
      });

      const compilation = process.createCompilation();
      preset.current = compilation.createStatsOptions(getPreset(logLevel));
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
