import { dirname, basename } from 'path';
import { PiletRuleContext } from '../types';
import { readText, matchFiles } from '../common';

function getSourceFiles(dir: string): Promise<Array<string>> {
  return matchFiles(dir, '**/*.(j|t)sx?');
}

export type Options = 'ignore' | 'active';

export default async function(this: PiletRuleContext, options: Options = 'ignore') {
  if (options !== 'ignore') {
    const { name } = this.data.appPackage;
    const tester = new RegExp(`(import .* from ["'\`]${name}["'\`]|require\\(["'\`]${name}["'\`]\\));`);
    const files = await getSourceFiles(dirname(this.entry));

    for (const file of files) {
      const target = dirname(file);
      const fileName = basename(file);
      const fileContent = await readText(target, fileName);

      if (tester.test(fileContent)) {
        this.error(
          `
The Piral instance is referenced in "${file}".
  Expected: No import of "${name}".
  Received: Import seen.
`,
        );
      }
    }
  }
}
