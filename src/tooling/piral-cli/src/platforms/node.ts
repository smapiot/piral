import { PlatformStartShellOptions, PlatformStartModuleOptions } from '../types';

async function startModule(options: PlatformStartModuleOptions) {
  //TODO
}

async function startShell(options: PlatformStartShellOptions) {
  //TODO
}

export function setup() {
  return {
    startModule,
    startShell,
  };
}
