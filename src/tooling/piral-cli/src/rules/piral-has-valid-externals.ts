import { PiralRuleContext } from '../types';

export type Options = void;

/**
 * Checks that the externals to be used in pilets are valid.
 */
export default function (context: PiralRuleContext, options: Options = undefined) {
  const { externals } = context;
  const invalidDepRefs = externals
    .filter((ext) => !ext.parents || ext.parents.length === 0)
    .map((ext) => ext.name)
    .filter((name) => context.dependencies[name] === undefined && context.devDependencies[name] === undefined);

  for (const invalidDepRef of invalidDepRefs) {
    context.warning(
      `
The shared dependency "${invalidDepRef}" is not listed in the "dependencies" and "devDependencies".
Expected: "${invalidDepRef}" in dependencies.
Received: <none>.
`,
    );
  }
}
