import { PiralRuleContext } from '../types';

export type Options = void;

/**
 * Checks that the Piral instance depends either on `piral` or `piral-core`.
 */
export default function(this: PiralRuleContext, options: Options = undefined) {
  if (!this.dependencies.piral && !this.dependencies.piralCore) {
    this.warning(`
The dependencies of the Piral instance should list either piral or piral-core.
  Expected: "piral" | "piral-core" in dependencies.
  Received: <none>.
`);
  }
}
