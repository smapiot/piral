import * as webpack from 'webpack';
import { resolve, basename, dirname } from 'path';
import { EventEmitter } from 'events';
import type { LogLevels, BundleHandlerResponse } from 'piral-cli';

function getOutput(stats: webpack.Stats) {
  const { outputPath, entrypoints } = stats.toJson();

  for (const name of Object.keys(entrypoints)) {
    const assets = entrypoints[name].assets;
    const firstAsset = assets[0];
    return resolve(outputPath, firstAsset.name);
  }
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

export function runWebpack(wpConfig: webpack.Configuration, logLevel: LogLevels): BundleHandlerResponse {
  const eventEmitter = new EventEmitter();
  const outDir = wpConfig.output.path;
  const bundle = {
    outFile: '',
    outDir,
    name: '',
    hash: '',
    requireRef: undefined,
  };

  const updateBundle = (stats: webpack.Stats) => {
    const file = getOutput(stats);
    bundle.name = basename(file);
    bundle.requireRef = stats.compilation.outputOptions?.uniqueName;
    bundle.hash = stats.hash;
    bundle.outFile = `/${basename(file)}`;
    bundle.outDir = dirname(file);
  };

  wpConfig.plugins.push({
    apply(compiler: webpack.Compiler) {
      compiler.hooks.beforeCompile.tap('piral-cli', () => {
        eventEmitter.emit('start');
      });

      compiler.hooks.done.tap('piral-cli', (stats) => {
        updateBundle(stats);
        eventEmitter.emit('end', bundle);
      });
    },
  });

  return {
    bundle() {
      return new Promise((resolve, reject) => {
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
              updateBundle(stats);
              resolve(bundle);
            }
          }
        });

        if (process) {
          // process is undefined in case of an error
          const compilation = process.createCompilation();
          preset.current = compilation.createStatsOptions(getPreset(logLevel));
        }
      });
    },
    onStart(cb) {
      eventEmitter.on('start', cb);
    },
    onEnd(cb) {
      eventEmitter.on('end', cb);
    },
  };
}
