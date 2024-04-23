import { fail } from './log';
import { PlatformStartShellOptions, PlatformStartModuleOptions } from '../types';

export interface WebPlatformSettings {
  platform: 'web';
}

export interface NodePlatformSettings {
  platform: 'node';
}

export type PlatformSettings = WebPlatformSettings | NodePlatformSettings;

export interface UpdatePlatformOptions {
  (options: any): void;
}

export interface PlatformTarget {
  startShell(options: PlatformStartShellOptions): Promise<UpdatePlatformOptions>;
  startModule(options: PlatformStartModuleOptions): Promise<UpdatePlatformOptions>;
}

export function configurePlatform(target: Partial<PlatformSettings> = {}): PlatformTarget {
  const { platform = 'web', ...options } = target;

  if (platform === 'web') {
    const { setup } = require('../platforms/web');
    return setup(options);
  } else if (platform === 'node') {
    const { setup } = require('../platforms/node');
    return setup(options);
  }

  return fail('platformNotSupported_0190', platform);
}
