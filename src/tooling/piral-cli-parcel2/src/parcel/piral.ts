import type { PiralBuildHandler } from 'piral-cli';
import { Parcel } from '@parcel/core';
import { getFreePort } from 'piral-cli/utils';
import { getLevel } from './common';
import { runParcel } from './bundler-run';

const handler: PiralBuildHandler = {
  async create(options) {
    const port = options.hmr ? await getFreePort(62123) : undefined;
    const bundler = new Parcel({
      entries: options.entryFiles,
      defaultConfig: require.resolve('./piral.config.json'),
      hmrOptions: port && { port },
      mode: process.env.NODE_ENV || 'development',
      defaultTargetOptions: {
        isLibrary: false,
        distDir: options.outDir,
      },
      logLevel: getLevel(options.logLevel),
    });

    return runParcel(bundler, options);
  },
};

export const create = handler.create;
