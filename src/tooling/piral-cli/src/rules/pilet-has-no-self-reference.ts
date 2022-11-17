import { PiletRuleContext } from '../types';
import { getSourceFiles } from '../common';

export type Options = 'ignore' | 'active';

/**
 * Checks if the used Piral instance is not referenced in the code.
 */
export default async function (context: PiletRuleContext, options: Options = 'ignore') {
  if (options !== 'ignore') {
    const { name } = context.apps[0].appPackage;
    const names = ['piral', 'piral-core', 'piral-base', name];
    const files = await getSourceFiles(context.entry);
    const testers: Array<RegExp> = [];

    for (const packageName of names) {
      testers.push(
        new RegExp(`(import\\s+.*\\s+from\\s+["'\`]${packageName}["'\`]|require\\(["'\`]${packageName}["'\`]\\));`),
      );
    }

    for (const file of files) {
      const fileContent = await file.read();

      for (const tester of testers) {
        if (tester.test(fileContent)) {
          context.error(
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
