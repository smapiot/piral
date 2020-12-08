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
  return resolve(outputPath, assets[0]);
}

function getPreset(logLevel: LogLevels): webpack.Stats.Preset {
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
  const preset = webpack.Stats.presetToOptions(getPreset(logLevel));
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

      compiler.hooks.done.tap('piral-cli', (stats) => {
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
              ...preset,
              colors: true,
            }),
          );

          if (stats.hasErrors()) {
            reject(stats.toJson(preset));
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
