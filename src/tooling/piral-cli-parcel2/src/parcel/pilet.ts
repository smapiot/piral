import type { PiletBuildHandler } from 'piral-cli';
import { Parcel } from '@parcel/core';
import { getLevel } from './common';
import { runParcel } from './bundler-run';

const handler: PiletBuildHandler = {
  create(options) {
    const bundler = new Parcel({
      entries: options.entryModule,
      defaultConfig: require.resolve('./pilet.config.json'),
      mode: process.env.NODE_ENV || 'development',
      defaultTargetOptions: {
        format: 'esmodule',
        isLibrary: true,
        distDir: options.outDir,
      },
      logLevel: getLevel(options.logLevel),
    });

    return runParcel(bundler, options);
  },
};

export const create = handler.create;
