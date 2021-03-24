import { PiletRuleContext } from '../types';
import { getPiletsInfo, getSourceFiles, isValidDependency } from '../common';

export type Options = 'ignore' | 'active' | 'only-used';

function printError(context: PiletRuleContext, label: string, missing: Array<{ name: string }>) {
  if (missing.length > 0) {
    const missingNames = missing.map((m) => m.name);
    context.error(
      `
The ${label} miss some of the shared dependencies.
Expected: <none>.
Received: Missing "${missingNames.join('", "')}".
`,
    );
  }
}

/**
 * Checks that "externals" dependencies have been specified in "peerDependencies".
 */
export default async function (context: PiletRuleContext, options: Options = 'ignore') {
  if (options !== 'ignore') {
    const { externals } = getPiletsInfo(context.data.appPackage);
    const markedPeerDependencies = Object.keys(context.peerDependencies);
    const markedPeerModules = context.peerModules;
    const missingExternals = externals
      .map((name) => {
        const valid = isValidDependency(name);
        const missing = !(valid ? markedPeerDependencies : markedPeerModules).includes(name);
        return { name, valid, missing };
      })
      .filter((m) => m.missing);

    if (options === 'only-used' && missingExternals.length > 0) {
      const testers = missingExternals
        .map((ext) => ext.name)
        .map((ext) => ({
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

    printError(
      context,
      'peerDependencies',
      missingExternals.filter((m) => m.valid),
    );
    printError(
      context,
      'peerModules',
      missingExternals.filter((m) => !m.valid),
    );
  }
}
