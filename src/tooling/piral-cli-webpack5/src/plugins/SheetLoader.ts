import { getOptions } from 'loader-utils';

export default function sheetLoader() {
  const { cssName, piletName } = getOptions(this);
  const debug = process.env.NODE_ENV === 'development';
  return [
    `var d=document`,
    `var u=__webpack_public_path__+${JSON.stringify(cssName)}`,
    `var e=d.createElement("link")`,
    `e.setAttribute('data-origin', ${JSON.stringify(piletName)})`,
    `e.type="text/css"`,
    `e.rel="stylesheet"`,
    `e.href=${debug ? 'u+"?_="+Math.random()' : 'u'}`,
    `d.head.appendChild(e)`,
  ].join(';');
}
