import { PiralRuleContext } from '../types';

export function piralHasValidDevDependencies(this: PiralRuleContext) {
  const { devDependencies } = this.info;

  if (typeof devDependencies !== 'object') {
    this.error(
      `
The scripts in pilets.devDependencies are invalid.
  Expected: <object>.
  Received: <${typeof devDependencies}>.
`,
    );
  } else {
    const allDependencies = {
      ...this.dependencies,
      ...this.devDependencies,
    };
    const invalidDevDepsTypes = Object.keys(devDependencies)
      .map(m => devDependencies[m])
      .filter(m => typeof m !== 'string' && m !== true);
    const invalidDevDepsRefs = Object.keys(devDependencies).filter(
      m => devDependencies[m] === true && !allDependencies[m],
    );

    if (invalidDevDepsTypes.length > 0) {
      this.error(
        `
The scaffold dev dependencies in pilets.devDependencies are invalid.
  Expected: Only names (<string>) in the array.
  Received: Found ${invalidDevDepsTypes.length} non-<string> entries.
`,
      );
    }

    for (const invalidDevDepsRef of invalidDevDepsRefs) {
      this.warning(
        `
The scaffold dev dependency "${invalidDevDepsRef}" refers to any dependency in the app, but none found.
  Expected: A dependency named "${invalidDevDepsRef}" in dependencies or devDependencies.
  Received: <none>.
`,
      );
    }
  }
}
