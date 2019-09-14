import { PiletRuleContext } from '../types';
import { getPiletsInfo } from '../common';

export type Options = 'ignore' | 'active' | 'only-used';

export default function(this: PiletRuleContext, options: Options = 'ignore') {
  if (options !== 'ignore') {
    const { externals } = getPiletsInfo(this.data.appPackage);
    const markedExternals = Object.keys(this.peerDependencies);
    const missingExternals = externals.filter(ext => !markedExternals.includes(ext));

    if (missingExternals.length > 0) {
      //TODO if only-used do further investigation
      this.error(
        `
The peerDependencies miss some of the shared dependencies.
  Expected: <none>.
  Received: Missing "${missingExternals.join('", "')}".
`,
      );
    }
  }
}
