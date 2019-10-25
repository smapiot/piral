import { PiralRuleContext } from '../types';

export type Options = void;

/**
 * Checks that the Piral instance depends either on `piral` or `piral-core`.
 */
export default function(context: PiralRuleContext, options: Options = undefined) {
  if (!context.dependencies.piral && !context.dependencies.piralCore) {
    context.warning(`
The dependencies of the Piral instance should list either piral or piral-core.
  Expected: "piral" | "piral-core" in dependencies.
  Received: <none>.
`);
  }
}
