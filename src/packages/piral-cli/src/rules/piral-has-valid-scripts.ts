import { PiralRuleContext } from '../types';

export type Options = void;

/**
 * Checks that the scripts defined for pilets are valid.
 */
export default function(this: PiralRuleContext, options: Options = undefined) {
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
