import { PiletRuleContext } from '../types';

export type Options = 'ignore' | 'active';

export default function(this: PiletRuleContext, options: Options = 'ignore') {
  if (options !== 'ignore') {
    const dependencies = Object.keys(this.dependencies);

    if (dependencies.length > 0) {
      this.error(
        `
The pilet references third-party dependencies.
  Expected: <none>.
  Received: "${dependencies.join(', ')}".
`,
      );
    }
  }
}
