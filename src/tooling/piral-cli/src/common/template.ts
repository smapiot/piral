import { ForceOverwrite } from './enums';
import { createFileIfNotExists } from './io';

export interface PiralStubFileTemplateData {
  outFile: string;
  name: string;
}

function fillTemplate(data: PiralStubFileTemplateData) {
  return `if (process.env.NODE_ENV === 'test') {
  // behavior for the test environment, we'll try to make it work

  if (typeof window !== 'undefined') {
    require('./${data.outFile}');
    const ctx = window['dbg:piral'];
    const dependencies = (ctx && ctx.pilets && ctx.pilets.getDependencies({})) || {};
    module.exports = dependencies['${data.name}'] || {};
  } else {
    console.error('Your test environment does not define "window". Please make sure to provide a proper environment.');
    module.exports = {};
  }
} else {
  // under "normal" circumstances disallow such an import
  throw new Error("This file should not be included anywhere. Usually, this means you've imported the Piral instance directly.");
}
`;
}

export async function createPiralStubIndexIfNotExists(
  targetDir: string,
  fileName: string,
  forceOverwrite: ForceOverwrite,
  data: PiralStubFileTemplateData,
) {
  const content = fillTemplate(data);
  await createFileIfNotExists(targetDir, fileName, content, forceOverwrite);
}
