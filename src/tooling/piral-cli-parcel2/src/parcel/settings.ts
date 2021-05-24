import { defaultCacheDir } from './constants';
import { ParcelConfig } from '../types';

export function extendConfig(options: ParcelConfig): ParcelConfig {
  return {
    cache: true,
    cacheDir: defaultCacheDir,
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
