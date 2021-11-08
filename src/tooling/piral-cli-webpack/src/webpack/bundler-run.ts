import * as webpack from 'webpack';
import { resolve, basename, dirname } from 'path';
import { EventEmitter } from 'events';
import type { LogLevels, BundleHandlerResponse } from 'piral-cli';

function getOutput(stats: webpack.Stats) {
  const { outputPath, entrypoints } = stats.toJson();

  for (const name of Object.keys(entrypoints)) {
    const assets = entrypoints[name].assets;
    return resolve(outputPath, assets[0]);
  }
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

export function runWebpack(wpConfig: webpack.Configuration, logLevel: LogLevels): BundleHandlerResponse {
  const eventEmitter = new EventEmitter();
  const outDir = wpConfig.output.path;
  const preset = webpack.Stats.presetToOptions(getPreset(logLevel));
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
    bundle.requireRef = stats.compilation.outputOptions?.jsonpFunction?.replace('_chunks', '');
    bundle.hash = stats.hash;
    bundle.outFile = `/${basename(file)}`;
    bundle.outDir = dirname(file);
  };

  wpConfig.plugins.push({
    apply(compiler) {
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
              updateBundle(stats);
              resolve(bundle);
            }
          }
        });
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
