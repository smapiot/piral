import { readJson } from 'piral-cli/utils';

export async function getConfig<T>(root: string, name: string, validator: (config: any) => T): Promise<T> {
  const fileName = 'package.json';
  const details = await readJson(root, fileName);
  const section = details[name];

  if (!section) {
    throw new Error(`Could not find a "${name}" section in the "${fileName}" of "${root}". Make sure it exists.`);
  }

  try {
    return validator(section);
  } catch (err) {
    throw new Error(`Error while validating the "${name}" section of the "${fileName}": ${err.message}`);
  }
}
