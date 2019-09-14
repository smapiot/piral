import { PiralRuleContext } from '../types';

export interface Options {}

export default function(this: PiralRuleContext, options: Options = {}) {
  const { scripts } = this.info;

  if (typeof scripts !== 'object') {
    this.error(
      `
The scripts in pilets.scripts are invalid.
  Expected: <object>.
  Received: <${typeof scripts}>.
`,
    );
  } else {
    const invalidScripts = Object.keys(scripts).filter(key => typeof scripts[key] !== 'string');

    if (invalidScripts.length > 0) {
      this.error(
        `
The scripts in pilets.scripts are invalid.
  Expected: Only commands (<string>) in the array.
  Received: Found ${invalidScripts.length} invalid entries.
  `,
      );
    }
  }
}
