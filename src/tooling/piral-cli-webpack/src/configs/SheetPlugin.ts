import InjectPlugin from 'webpack-inject-plugin';

function sheetLoader(cssName: string) {
  return () => {
    const lines = [
      `var d=document`,
      `var e=d.createElement("link")`,
      `e.type="text/css"`,
      `e.rel="stylesheet"`,
      `e.href=__webpack_public_path__ + ${JSON.stringify(cssName)}`,
      `d.head.appendChild(e)`,
    ];
    return lines.join(';');
  };
}

export default class SheetPlugin extends InjectPlugin {
  constructor(cssName: string) {
    super(sheetLoader(cssName));
  }
}
