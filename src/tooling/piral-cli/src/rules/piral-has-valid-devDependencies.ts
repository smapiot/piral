import { PiralRuleContext } from '../types';

export type Options = void;

/**
 * Checks that devDependencies declared for pilet scaffolding are valid.
 */
export default function (context: PiralRuleContext, options: Options = undefined) {
  const { devDependencies } = context.info;

  if (typeof devDependencies !== 'object') {
    context.error(
      `
The scripts in pilets.devDependencies are invalid.
  Expected: <object>.
  Received: <${typeof devDependencies}>.
`,
    );
  } else {
    const allDependencies = {
      ...context.dependencies,
      ...context.devDependencies,
    };
    const invalidDevDepsTypes = Object.keys(devDependencies)
      .map((m) => devDependencies[m])
      .filter((m) => typeof m !== 'string' && m !== true);
    const invalidDevDepsRefs = Object.keys(devDependencies).filter(
      (m) => devDependencies[m] === true && !allDependencies[m],
    );

    if (invalidDevDepsTypes.length > 0) {
      context.error(
        `
The scaffold dev dependencies in pilets.devDependencies are invalid.
  Expected: Only names (<string>) in the array.
  Received: Found ${invalidDevDepsTypes.length} non-<string> entries.
`,
      );
    }

    for (const invalidDevDepsRef of invalidDevDepsRefs) {
      context.warning(
        `
The scaffold dev dependency "${invalidDevDepsRef}" refers to any dependency in the app, but none found.
  Expected: A dependency named "${invalidDevDepsRef}" in dependencies or devDependencies.
  Received: <none>.
`,
      );
    }
  }
}
