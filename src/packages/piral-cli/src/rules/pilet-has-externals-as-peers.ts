import { PiletRuleContext } from '../types';
import { getPiletsInfo, getSourceFiles } from '../common';

export type Options = 'ignore' | 'active' | 'only-used';

export default async function(this: PiletRuleContext, options: Options = 'ignore') {
  if (options !== 'ignore') {
    const { externals } = getPiletsInfo(this.data.appPackage);
    const markedExternals = Object.keys(this.peerDependencies);
    const missingExternals = externals.filter(ext => !markedExternals.includes(ext));

    if (missingExternals.length > 0) {
      if (options === 'only-used') {
        const testers = missingExternals.map(ext => ({
          run: new RegExp(`(import .* from ["'\`]${ext}["'\`]|require\\(["'\`]${ext}["'\`]\\));`),
          count: 0,
        }));
        const files = await getSourceFiles(this.entry);

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

      this.error(
        `
The peerDependencies miss some of the shared dependencies.
  Expected: <none>.
  Received: Missing "${missingExternals.join('", "')}".
`,
      );
    }
  }
}
