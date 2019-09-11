import { join, extname, basename } from 'path';
import { existsSync, statSync, readdirSync } from 'fs';
import { retrievePiralRoot, retrievePiletsInfo } from '../common';

function hasSubdirectories(target: string) {
  if (statSync(target).isDirectory()) {
    return readdirSync(target).some(name => statSync(join(target, name)).isDirectory());
  }

  return false;
}

export interface ValidatPiralOptions {
  entry?: string;
  logLevel?: 1 | 2 | 3;
}

export const validatePiralDefaults = {
  entry: './',
  logLevel: 3 as const,
};

export async function validatePiral(baseDir = process.cwd(), options: ValidatPiralOptions = {}) {
  const { entry = validatePiralDefaults.entry, logLevel = validatePiralDefaults.logLevel } = options;
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const { externals, devDependencies, files, scripts, root } = await retrievePiletsInfo(entryFiles);
  const { dependencies = {}, devDependencies: originalDevDeps } = require(join(root, 'package.json'));
  const allDependencies = {
    ...dependencies,
    ...originalDevDeps,
  };
  const errors: Array<string> = [];
  const warnings: Array<string> = [];

  if (entryFiles.endsWith('.html')) {
    warnings.push(`
The resolved app should be an HTML file, otherwise it may be an invalid bundler entry point.
  Expected: Ends with ".html".
  Received: Ends with "${extname(entryFiles)}".
`);
  }

  if (!dependencies.piral && !dependencies.piralCore) {
    warnings.push(`
The dependencies of the Piral instance should list either piral or piral-core.
  Expected: "piral" | "piral-core" in dependencies.
  Received: <none>.
`);
  }

  if (!Array.isArray(externals)) {
    errors.push(
      `
The shared dependencies in pilets.external are invalid.
  Expected: <Array>.
  Received: <${typeof externals}>.
`,
    );
  } else {
    const invalidDepTypes = externals.filter(ext => typeof ext !== 'string');
    const invalidDepRefs = externals.filter(ext => typeof ext === 'string' && !dependencies[ext]);

    if (invalidDepTypes.length > 0) {
      errors.push(
        `
The shared dependencies in pilets.external are invalid.
  Expected: Only names (<string>) in the array.
  Received: Found ${invalidDepTypes.length} non-<string> entries.
`,
      );
    }

    for (const invalidDepRef of invalidDepRefs) {
      warnings.push(
        `
The shared dependency "${invalidDepRef}" is listed in pilets.external, but not in dependencies.
  Expected: "${invalidDepRef}" in dependencies.
  Received: <none>.
`,
      );
    }
  }

  if (typeof scripts !== 'object') {
    errors.push(
      `
The scripts in pilets.scripts are invalid.
  Expected: <object>.
  Received: <${typeof scripts}>.
`,
    );
  } else {
    const invalidScripts = Object.keys(scripts).filter(key => typeof scripts[key] !== 'string');

    if (invalidScripts.length > 0) {
      errors.push(
        `
The scripts in pilets.scripts are invalid.
  Expected: Only commands (<string>) in the array.
  Received: Found ${invalidScripts.length} invalid entries.
  `,
      );
    }
  }

  if (!Array.isArray(files)) {
    errors.push(
      `
The scaffolding files in pilets.files are invalid.
  Expected: <Array>.
  Received: <${typeof files}>.
`,
    );
  } else {
    const invalidFileTypes = files.filter(file => {
      if (typeof file === 'string') {
        return false;
      } else if (file && typeof file.from === 'string' && typeof file.to === 'string') {
        return false;
      }

      return true;
    });
    const validFileRefs = files.filter(file => !invalidFileTypes.includes(file));
    const ignoredFiles = ['.gitignore'];

    if (invalidFileTypes.length > 0) {
      errors.push(
        `
The scaffolding files in pilets.files are invalid.
  Expected: Only names (<string>) and explicit location mappings (<{ from: string, to: string }>) in the array.
  Received: Found ${invalidFileTypes.length} invalid entries.
`,
      );
    }

    for (const file of validFileRefs) {
      const { from, deep } = typeof file === 'string' ? { from: file, deep: undefined } : file;
      const target = join(root, from);

      if (!existsSync(target)) {
        errors.push(
          `
  The scaffolding file ${JSON.stringify(file)} is listed in pilets.files but cannot be found.
    Expected: "${from}" exists on disk.
    Received: File "${target}" not found.
  `,
        );
      } else if (hasSubdirectories(target) && deep === undefined) {
        warnings.push(
          `
The scaffolding directory ${JSON.stringify(file)} listed in pilets.files has sub-directories, but does not explicitly set deep.
  Expected: <true> | <false>.
  Received: <undefined>.
`,
        );
      } else if (ignoredFiles.includes(basename(target))) {
        errors.push(
          `
The scaffolding file ${JSON.stringify(file)} is listed in pilets.files but will be ignored when packaging.
  Expected: "${from}" has a different name.
  Received: Ignored name "${from}".
`,
        );
      }
    }
  }

  if (typeof devDependencies !== 'object') {
    errors.push(
      `
The scripts in pilets.devDependencies are invalid.
  Expected: <object>.
  Received: <${typeof devDependencies}>.
`,
    );
  } else {
    const invalidDevDepsTypes = Object.keys(devDependencies)
      .map(m => devDependencies[m])
      .filter(m => typeof m !== 'string' && m !== true);
    const invalidDevDepsRefs = Object.keys(devDependencies).filter(
      m => devDependencies[m] === true && !allDependencies[m],
    );

    if (invalidDevDepsTypes.length > 0) {
      errors.push(
        `
The scaffold dev dependencies in pilets.devDependencies are invalid.
  Expected: Only names (<string>) in the array.
  Received: Found ${invalidDevDepsTypes.length} non-<string> entries.
`,
      );
    }

    for (const invalidDevDepsRef of invalidDevDepsRefs) {
      warnings.push(
        `
The scaffold dev dependency "${invalidDevDepsRef}" refers to any dependency in the app, but none found.
  Expected: A dependency named "${invalidDevDepsRef}" in dependencies or devDependencies.
  Received: <none>.
`,
      );
    }
  }
}
