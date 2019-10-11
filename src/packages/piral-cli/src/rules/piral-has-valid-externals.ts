import { PiralRuleContext } from '../types';

export interface Options {}

export default function(this: PiralRuleContext, options: Options = {}) {
  const { externals } = this.info;

  if (!Array.isArray(externals)) {
    this.error(
      `
The shared dependencies in pilets.external are invalid.
  Expected: <Array>.
  Received: <${typeof externals}>.
`,
    );
  } else {
    const invalidDepTypes = externals.filter(ext => typeof ext !== 'string');
    const invalidDepRefs = externals.filter(ext => typeof ext === 'string' && !this.dependencies[ext]);

    if (invalidDepTypes.length > 0) {
      this.error(
        `
The shared dependencies in pilets.external are invalid.
  Expected: Only names (<string>) in the array.
  Received: Found ${invalidDepTypes.length} non-<string> entries.
`,
      );
    }

    for (const invalidDepRef of invalidDepRefs) {
      this.warning(
        `
The shared dependency "${invalidDepRef}" is listed in pilets.external, but not in dependencies.
  Expected: "${invalidDepRef}" in dependencies.
  Received: <none>.
`,
      );
    }
  }
}
