import { fail } from './log';
import { PlatformStartShellOptions, PlatformStartModuleOptions } from '../types';

export interface WebPlatformSettings {
  platform: 'web';
}

export interface NodePlatformSettings {
  platform: 'node';
}

export type PlatformSettings = WebPlatformSettings | NodePlatformSettings;

export interface PlatformTarget {
  startShell(options: PlatformStartShellOptions): Promise<void>;
  startModule(options: PlatformStartModuleOptions): Promise<void>;
}

export function configurePlatform(target: Partial<PlatformSettings> = {}): PlatformTarget {
  const { platform = 'web' } = target;

  if (platform === 'web') {
    return require('../platforms/web');
  }

  return fail('platformNotSupported_0190', platform);
}
