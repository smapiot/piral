import { getOptions } from 'loader-utils';

export default function stylesLoader() {
  const { cssName, entries } = getOptions(this);
  const debug = process.env.NODE_ENV === 'development';
  return [
    `const u = ${JSON.stringify(cssName)}`,
    `export const styles = [${debug ? 'u+"?_="+Math.random()' : 'u'}]`,
    ...entries.split(',').map((entry) => `export * from ${JSON.stringify(entry)}`),
  ].join(';');
}
