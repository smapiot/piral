import { PiletRuleContext } from '../types';
import { getSourceFiles } from '../common';

export type Options = 'ignore' | 'active';

/**
 * Checks if the used Piral instance is not referenced in the code.
 */
export default async function(this: PiletRuleContext, options: Options = 'ignore') {
  if (options !== 'ignore') {
    const { name } = this.data.appPackage;
    const names = ['piral', 'piral-core', name];
    const files = await getSourceFiles(this.entry);
    const testers: Array<RegExp> = [];

    for (const packageName of names) {
      testers.push(new RegExp(`(import\\s+.*\\s+from\\s+["'\`]${packageName}["'\`]|require\\(["'\`]${packageName}["'\`]\\));`));
    }

    for (const file of files) {
      const fileContent = await file.read();

      for (const tester of testers) {
        if (tester.test(fileContent)) {
          this.error(
            `
The Piral instance is referenced in "${file.path}".
  Expected: No import of "${name}" or Piral itself.
  Received: Import seen.
`,
          );
          break;
        }
      }
    }
  }
}
