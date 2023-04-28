import { getOptions } from 'loader-utils';

export default function stylesLoader() {
  const { cssName } = getOptions(this);
  const debug = process.env.NODE_ENV === 'development';
  return [
    `const u = ${JSON.stringify(cssName)}`,
    `export const styles = [${debug ? 'u+"?_="+Math.random()' : 'u'}]`,
  ].join(';');
}
