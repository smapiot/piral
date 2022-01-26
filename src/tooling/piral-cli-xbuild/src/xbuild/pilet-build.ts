import type { BundleResult, PiletBuildHandler } from 'piral-cli';
import { checkExists, runScript } from 'piral-cli/utils';
import { resolve } from 'path';
import { EventEmitter } from 'events';
import { getConfig } from '../helpers';

interface ToolConfig {
  command: string;
  outputDir: string;
  mainFile: string;
  skipTransform: boolean;
}

function validateConfig(config: any): ToolConfig {
  if (typeof config.command !== 'string') {
    throw new Error('The required "command" property needs to be a string.');
  }

  if (typeof config.outputDir !== 'string') {
    throw new Error('The required "outputDir" property needs to be a string.');
  }

  if (typeof config.mainFile !== 'string') {
    throw new Error('The required "mainFile" property needs to be a string.');
  }

  if (config.skipTransform !== undefined && typeof config.skipTransform !== 'boolean') {
    throw new Error('The optional "skipTransform" property needs to be a boolean.');
  }

  return {
    command: config.command,
    mainFile: config.mainFile,
    outputDir: config.outputDir,
    skipTransform: config.skipTransform || false,
  };
}

const handler: PiletBuildHandler = {
  async create(options) {
    const {
      root,
      contentHash,
      entryModule,
      externals,
      importmap,
      logLevel,
      minify,
      outDir,
      outFile,
      piral,
      sourceMaps,
      targetDir,
      version,
    } = options;

    const eventEmitter = new EventEmitter();
    const config = await getConfig(root, 'pilet:build', validateConfig);

    process.env.PIRAL_ROOT = root;
    process.env.PIRAL_LOG_LEVEL = logLevel.toString();
    process.env.PIRAL_TARGET = targetDir;

    process.env.PILET_CONTENT_HASH = contentHash.toString();
    process.env.PILET_SOURCE_MAPS = sourceMaps.toString();
    process.env.PILET_MINIFY = minify.toString();
    process.env.PILET_ENTRY_MODULE = entryModule;
    process.env.PILET_EXTERNALS = externals.join(',');
    process.env.PILET_IMPORTMAP = JSON.stringify(importmap);
    process.env.PILET_SCHEMA = version;
    process.env.PILET_PIRAL_INSTANCE = piral;

    return {
      async bundle() {
        eventEmitter.emit('start', {});

        await runScript(config.command, root);

        const output = resolve(root, config.outputDir);
        const mainFile = resolve(output, config.mainFile);

        const exists = await checkExists(mainFile);

        if (!exists) {
          throw new Error(
            `Could not find file "${mainFile}". Maybe the command "${config.command}" did not run successfully.`,
          );
        }

        if (!config.skipTransform) {
          //TODO transform to schema
        }

        //TODO copy files to target

        const result = {
          outDir,
          outFile,
        };

        eventEmitter.emit('end', result);

        return result;
      },
      onEnd(cb: (result: BundleResult) => void) {
        eventEmitter.on('end', cb);
      },
      onStart(cb: () => void) {
        eventEmitter.on('start', cb);
      },
    };
  },
};

export const create = handler.create;
