import { PiralRuleContext } from '../types';

export type Options = void;

/**
 * Checks that the externals to be used in pilets are valid.
 */
export default function (context: PiralRuleContext, options: Options = undefined) {
  const { externals } = context.info;

  if (!Array.isArray(externals)) {
    context.error(
      `
The shared dependencies in pilets.external are invalid.
  Expected: <Array>.
  Received: <${typeof externals}>.
`,
    );
  } else {
    const invalidDepTypes = externals.filter((ext) => typeof ext !== 'string');
    const invalidDepRefs = externals.filter((ext) => typeof ext === 'string' && !context.dependencies[ext]);

    if (invalidDepTypes.length > 0) {
      context.error(
        `
The shared dependencies in pilets.external are invalid.
  Expected: Only names (<string>) in the array.
  Received: Found ${invalidDepTypes.length} non-<string> entries.
`,
      );
    }

    for (const invalidDepRef of invalidDepRefs) {
      context.warning(
        `
The shared dependency "${invalidDepRef}" is listed in pilets.external, but not in dependencies.
  Expected: "${invalidDepRef}" in dependencies.
  Received: <none>.
`,
      );
    }
  }
}
