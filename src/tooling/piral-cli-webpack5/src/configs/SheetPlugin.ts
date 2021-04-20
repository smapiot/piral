import InjectPlugin from 'webpack-inject-plugin';

function sheetLoader() {
  return () => {
    return [
      `var d=document`,
      `var e=d.createElement("link")`,
      `e.type="text/css"`,
      `e.rel="stylesheet"`,
      `e.href=__webpack_public_path__ + ${JSON.stringify('main.css')}`,
      `d.head.appendChild(e)`,
    ].join(';');
  };
}

export default class SheetPlugin {
  apply(compiler) {
    new InjectPlugin(sheetLoader()).apply(compiler);
  }
};
