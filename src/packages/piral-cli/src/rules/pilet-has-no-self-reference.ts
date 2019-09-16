import { PiletRuleContext } from '../types';
import { getSourceFiles } from '../common';

export type Options = 'ignore' | 'active';

export default async function(this: PiletRuleContext, options: Options = 'ignore') {
  if (options !== 'ignore') {
    const { name } = this.data.appPackage;
    const tester = new RegExp(`(import .* from ["'\`]${name}["'\`]|require\\(["'\`]${name}["'\`]\\));`);
    const files = await getSourceFiles(this.entry);

    for (const file of files) {
      const fileContent = await file.read();

      if (tester.test(fileContent)) {
        this.error(
          `
The Piral instance is referenced in "${file.path}".
  Expected: No import of "${name}".
  Received: Import seen.
`,
        );
      }
    }
  }
}
