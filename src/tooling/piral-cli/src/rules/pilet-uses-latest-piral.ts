import { findLatestVersion } from '../common';
import { PiletRuleContext } from '../types';

export type Options = 'suggest' | 'required' | 'ignore';

/**
 * Checks if the used Piral instance is used at its latest version.
 */
export default async function (context: PiletRuleContext, options: Options = 'suggest') {
  if (options !== 'ignore') {
    const { name, version } = context.data.appPackage;
    const demanded = (context.devDependencies && context.devDependencies[name]) || '';
    const isfixed = demanded.startsWith('git+') || demanded.startsWith('file:');

    if (!isfixed) {
      const latestVersion = await findLatestVersion(name);

      if (version !== latestVersion) {
        const notify = options === 'required' ? context.error : context.warning;
        notify(
          `
The used version of "${name}" is outdated.
  Expected: v${latestVersion}.
  Received: v${version}.
`,
        );
      }
    }
  }
}
