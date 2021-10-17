import { BuildOptions, build } from 'esbuild';
import { resolve, dirname } from 'path';
import { EventEmitter } from 'events';
import { LogLevels } from 'piral-cli';

export function runEsbuild(config: BuildOptions, logLevel: LogLevels, watch: boolean) {
  const eventEmitter = new EventEmitter();
  const rootDir = process.cwd();
  const outDir = config.outdir ? resolve(rootDir, config.outdir) : dirname(resolve(rootDir, config.outfile));
  const requireRef = `esbuildpr_${process.env.BUILD_PCKG_NAME.replace(/\W/gi, '')}`;
  const name = Object.keys(config.entryPoints)[0];
  const mainBundle = {
    name,
    requireRef,
    entryAsset: {},
  };

  switch (logLevel) {
    case LogLevels.error:
      config.logLevel = 'error';
      break;
    case LogLevels.warning:
      config.logLevel = 'warning';
      break;
    case LogLevels.verbose:
      config.logLevel = 'verbose';
      break;
    case LogLevels.debug:
      config.logLevel = 'debug';
      break;
    case LogLevels.info:
      config.logLevel = 'info';
      break;
    case LogLevels.disabled:
      config.logLevel = 'silent';
      break;
  }

  config.plugins.push({
    name: 'piral-cli',
    setup(build) {
      build.onStart(() => {
        eventEmitter.emit('buildStart');
      });

      build.onEnd(() => {
        eventEmitter.emit('bundled');
      });
    },
  });

  if (watch) {
    config.watch = {
      onRebuild(err, result) {
        //TODO is required?
      },
    };
  }

  return {
    bundle() {
      return build(config).then(
        (result) => {
          if (result.errors.length > 0) {
            throw new Error(JSON.stringify(result.errors));
          } else {
            return {
              outFile: `/${name}.js`,
              outDir,
            };
          }
        },
        (err) => {
          console.error(err);
        },
      );
    },
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
