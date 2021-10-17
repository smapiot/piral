import type { BundleHandlerResponse, LogLevels } from 'piral-cli';
import { BuildOptions, build } from 'esbuild';
import { resolve, dirname } from 'path';
import { EventEmitter } from 'events';
import { getRequireRef } from '../shared';

export function runEsbuild(config: BuildOptions, logLevel: LogLevels, watch: boolean): Promise<BundleHandlerResponse> {
  const eventEmitter = new EventEmitter();
  const rootDir = process.cwd();
  const outDir = config.outdir ? resolve(rootDir, config.outdir) : dirname(resolve(rootDir, config.outfile));
  const name = `${Object.keys(config.entryPoints)[0]}.js`;
  const bundle = {
    outFile: `/${name}`,
    outDir,
    name,
    requireRef: getRequireRef(),
  };

  switch (logLevel) {
    case 0:
      config.logLevel = 'silent';
      break;
    case 1:
      config.logLevel = 'error';
      break;
    case 2:
      config.logLevel = 'warning';
      break;
    case 4:
      config.logLevel = 'verbose';
      break;
    case 5:
      config.logLevel = 'debug';
      break;
    case 3:
    default:
      config.logLevel = 'info';
      break;
  }

  config.plugins.push({
    name: 'piral-cli',
    setup(build) {
      build.onStart(() => {
        eventEmitter.emit('start');
      });

      build.onEnd(() => {
        eventEmitter.emit('end', bundle);
      });
    },
  });

  config.watch = watch;

  return Promise.resolve({
    bundle() {
      return build(config).then((result) => {
        if (result.errors.length > 0) {
          throw new Error(JSON.stringify(result.errors));
        } else {
          return bundle;
        }
      });
    },
    onStart(cb) {
      eventEmitter.on('start', cb);
    },
    onEnd(cb) {
      eventEmitter.on('end', cb);
    },
  });
}
