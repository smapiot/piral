import { findLatestVersion } from '../common';
import { PiletRuleContext } from '../types';

export type Options = 'suggest' | 'required' | 'ignore';

/**
 * Checks if the used Piral instance is used at its latest version.
 */
export default async function(this: PiletRuleContext, options: Options = 'suggest') {
  if (options !== 'ignore') {
    const { name, version } = this.data.appPackage;
    const latestVersion = await findLatestVersion(name);

    if (version !== latestVersion) {
      const notify = options === 'required' ? this.error : this.warning;
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
