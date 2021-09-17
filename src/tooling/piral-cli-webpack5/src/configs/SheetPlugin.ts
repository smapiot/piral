import InjectPlugin from 'webpack-inject-plugin';

function sheetLoader(cssName: string, name: string) {
  return () => {
    const debug = process.env.NODE_ENV === 'development';
    return [
      `var d=document`,
      `var u=__webpack_public_path__+${JSON.stringify(cssName)}`,
      `var e=d.createElement("link")`,
      `e.setAttribute('data-origin', ${JSON.stringify(name)})`,
      `e.type="text/css"`,
      `e.rel="stylesheet"`,
      `e.href=${debug ? 'u+"?_="+Math.random()' : 'u'}`,
      `d.head.nappendChild(e)`,
    ].join(';');
  };
}

export default class SheetPlugin extends InjectPlugin {
  constructor(cssName: string, name: string) {
    super(sheetLoader(cssName, name));
  }
}
