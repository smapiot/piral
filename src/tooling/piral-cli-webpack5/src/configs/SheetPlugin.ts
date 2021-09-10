import InjectPlugin from 'webpack-inject-plugin';

function sheetLoader(cssName: string, name: string) {
  return () => {
    const createNew = [
      `var e=d.createElement("link")`,
      `e.setAttribute('data-origin', ${JSON.stringify(name)})`,
      `e.type="text/css"`,
      `e.rel="stylesheet"`,
      `e.href=u`,
      `d.head.appendChild(e)`,
    ].join(';');
    const lines = [
      `var d=document`,
      `var u=__webpack_public_path__+${JSON.stringify(cssName)}`,
      `var f=d.querySelector('link[data-origin=${JSON.stringify(name)}]')`,
      `if(f){f.href=u+'?_='+Math.random()}else{${createNew}}`,
    ];
    return lines.join(';');
  };
}

export default class SheetPlugin extends InjectPlugin {
  constructor(cssName: string, name: string) {
    super(sheetLoader(cssName, name));
  }
}
