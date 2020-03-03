import { findCompatVersion, compatVersion, cliVersion } from './info';
import { findPackageVersion } from './package';
import { log } from './log';

export function checkAppShellCompatibility(piralVersion: string) {
  const compatible = findCompatVersion(piralVersion);

  if (compatVersion !== compatible) {
    log('appShellIncompatible_0100', piralVersion, cliVersion);
    return false;
  }

  return true;
}

export async function checkCliCompatibility(root: string) {
  const piralVersion = await findPackageVersion(root, 'piral-base');
  const compatible = findCompatVersion(piralVersion);

  if (compatVersion !== compatible) {
    log('toolingIncompatible_0101', piralVersion, cliVersion);
    return false;
  }

  return true;
}
