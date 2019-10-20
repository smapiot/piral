import { PiletRuleContext } from '../types';

export type Options = 'ignore' | 'active';

/**
 * Checks that no other (third-party) dependencies are bundled in.
 */
export default function(this: PiletRuleContext, options: Options = 'ignore') {
  if (options !== 'ignore') {
    const dependencies = Object.keys(this.dependencies);

    if (dependencies.length > 0) {
      this.error(
        `
The pilet references third-party dependencies.
  Expected: <none>.
  Received: "${dependencies.join('", "')}".
`,
      );
    }
  }
}
