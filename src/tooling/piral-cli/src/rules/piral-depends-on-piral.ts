import { PiralRuleContext } from '../types';

export type Options = void;

/**
 * Checks that the Piral instance depends either on `piral` or `piral-core` or `piral-base`.
 */
export default function (context: PiralRuleContext, options: Options = undefined) {
  if (!context.dependencies.piral && !context.dependencies.piralCore && !context.dependencies.piralBase) {
    context.warning(`
The dependencies of the Piral instance should list either piral, piral-core, or piral-base.
  Expected: "piral" | "piral-core" | "piral-base" in dependencies.
  Received: <none>.
`);
  }
}
