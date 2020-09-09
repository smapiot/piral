import { existsSync, statSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { PiralRuleContext } from '../types';

function hasSubdirectories(target: string) {
  if (statSync(target).isDirectory()) {
    return readdirSync(target).some((name) => statSync(join(target, name)).isDirectory());
  }

  return false;
}

export type Options = void;

/**
 * Checks that the files defined for pilet scaffolding are valid.
 */
export default function (context: PiralRuleContext, options: Options = undefined) {
  const { files } = context.info;

  if (!Array.isArray(files)) {
    context.error(
      `
The scaffolding files in pilets.files are invalid.
  Expected: <Array>.
  Received: <${typeof files}>.
`,
    );
  } else {
    const invalidFileTypes = files.filter((file) => {
      if (typeof file === 'string') {
        return false;
      } else if (file && typeof file.from === 'string' && typeof file.to === 'string') {
        return false;
      }

      return true;
    });
    const validFileRefs = files.filter((file) => !invalidFileTypes.includes(file));
    const ignoredFiles = ['.gitignore', '.npmignore'];

    if (invalidFileTypes.length > 0) {
      context.error(
        `
The scaffolding files in pilets.files are invalid.
  Expected: Only names (<string>) and explicit location mappings (<{ from: string, to: string }>) in the array.
  Received: Found ${invalidFileTypes.length} invalid entries.
`,
      );
    }

    for (const file of validFileRefs) {
      const { from, deep } = typeof file === 'string' ? { from: file, deep: undefined } : file;
      const target = join(context.root, from);

      if (!existsSync(target)) {
        context.error(
          `
  The scaffolding file ${JSON.stringify(file)} is listed in pilets.files but cannot be found.
    Expected: "${from}" exists on disk.
    Received: File "${target}" not found.
  `,
        );
      } else if (hasSubdirectories(target) && deep === undefined) {
        context.warning(
          `
The scaffolding directory ${JSON.stringify(
            file,
          )} listed in pilets.files has sub-directories, but does not explicitly set deep.
  Expected: <true> | <false>.
  Received: <undefined>.
`,
        );
      } else if (ignoredFiles.includes(basename(target))) {
        context.error(
          `
The scaffolding file ${JSON.stringify(file)} is listed in pilets.files but will be ignored when packaging.
  Expected: "${from}" has a different name.
  Received: Ignored name "${from}".
`,
        );
      }
    }
  }
}
