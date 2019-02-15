import { ParcelOptions } from 'parcel-bundler';

export function extendConfig(options: ParcelOptions): ParcelOptions {
  return {
    cache: true,
    cacheDir: '.cache',
    contentHash: false,
    scopeHoist: false,
    target: 'browser',
    logLevel: 3,
    hmrPort: 0,
    sourceMaps: true,
    detailedReport: true,
    ...options,
  };
}
