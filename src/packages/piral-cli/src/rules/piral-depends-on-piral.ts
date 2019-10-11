import { PiralRuleContext } from '../types';

export interface Options {}

export default function(this: PiralRuleContext, options: Options = {}) {
  if (!this.dependencies.piral && !this.dependencies.piralCore) {
    this.warning(`
The dependencies of the Piral instance should list either piral or piral-core.
  Expected: "piral" | "piral-core" in dependencies.
  Received: <none>.
`);
  }
}
