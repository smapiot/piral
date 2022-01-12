import { findCompatVersion, compatVersion, cliVersion } from './info';
import { findPackageVersion } from './package';
import { log } from './log';

export function checkAppShellCompatibility(piralVersion: string) {
  log('generalDebug_0003', `Checking compatibility ...`);

  if (!piralVersion) {
    log('appShellMaybeIncompatible_0102', cliVersion);
    return false;
  }

  const compatible = findCompatVersion(piralVersion);
  log('generalDebug_0003', `Used versions: "${compatible}" and "${compatVersion}".`);

  if (compatVersion !== compatible) {
    log('appShellIncompatible_0100', piralVersion, cliVersion);
    return false;
  }

  return true;
}

export async function checkCliCompatibility(root: string) {
  log('generalDebug_0003', `Checking compatibility ...`);
  const piralVersion = await findPackageVersion(root, 'piral-base');
  const compatible = findCompatVersion(piralVersion);
  log('generalDebug_0003', `Used versions: "${compatible}" and "${compatVersion}".`);

  if (compatVersion !== compatible) {
    log('toolingIncompatible_0101', piralVersion, cliVersion);
    return false;
  }

  return true;
}
