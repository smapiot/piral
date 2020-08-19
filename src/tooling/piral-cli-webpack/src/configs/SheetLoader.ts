export default async function SheetLoader() {
  const callback = this.async();
  const stylesheet = [
    `var d=document`,
    `var e=d.createElement("link")`,
    `e.type="text/css"`,
    `e.rel="stylesheet"`,
    `e.href=__webpack_public_path__ + ${JSON.stringify('main.css')}`,
    `d.head.appendChild(e)`,
  ].join(';');
  callback(undefined, stylesheet);
}
