import { findCompatVersion, compatVersion, cliVersion } from './info';
import { findPackageVersion } from './package';
import { logInfo, logWarn } from './log';

export function checkAppShellCompatibility(piralVersion: string) {
  const compatible = findCompatVersion(piralVersion);

  if (compatVersion !== compatible) {
    logWarn(
      `The found version of the Piral instance's CLI version (${piralVersion}) seems to be incompatible to the used version of the Piral CLI (${cliVersion}).`,
    );

    logInfo(`
  Recommendation: Update to the same version of the Piral CLI.

    npm i piral-cli@${piralVersion}

  Alternatively, you can also try to update the Piral instance.
`);
    return false;
  }

  return true;
}

export async function checkCliCompatibility(root: string) {
  const piralVersion = await findPackageVersion(root, 'piral-base');
  const compatible = findCompatVersion(piralVersion);

  if (compatVersion !== compatible) {
    logWarn(
      `The found version of Piral (${piralVersion}) seems to be incompatible to the used version of the Piral CLI (${cliVersion}).`,
    );

    logInfo(`
  Recommendation: Update to the same version of the Piral CLI.

    npm i piral-cli@${piralVersion}

  Alternatively, you can also change the used version of Piral.
`);
    return false;
  }

  return true;
}
