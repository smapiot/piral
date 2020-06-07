import { PiletRuleContext } from '../types';
import { getPiletsInfo, getSourceFiles } from '../common';

export type Options = 'ignore' | 'active' | 'only-used';

/**
 * Checks that "externals" dependencies have been specified in "peerDependencies".
 */
export default async function(context: PiletRuleContext, options: Options = 'ignore') {
  if (options !== 'ignore') {
    const { externals } = getPiletsInfo(context.data.appPackage);
    const markedExternals = Object.keys(context.peerDependencies);
    const missingExternals = externals.filter(ext => !markedExternals.includes(ext));

    if (options === 'only-used' && missingExternals.length > 0) {
      const testers = missingExternals.map(ext => ({
        run: new RegExp(`(import\\s+(.*\\s+from\\s+)?["'\`]${ext}["'\`]|require\\(["'\`]${ext}["'\`]\\));`),
        count: 0,
      }));
      const files = await getSourceFiles(context.entry);

      for (const file of files) {
        const fileContent = await file.read();

        for (const tester of testers) {
          if (tester.run.test(fileContent)) {
            tester.count++;
          }
        }
      }

      for (let i = missingExternals.length; i--; ) {
        if (testers[i].count === 0) {
          missingExternals.splice(i, 1);
        }
      }
    }

    if (missingExternals.length > 0) {
      context.error(
        `
The peerDependencies miss some of the shared dependencies.
  Expected: <none>.
  Received: Missing "${missingExternals.join('", "')}".
`,
      );
    }
  }
}
