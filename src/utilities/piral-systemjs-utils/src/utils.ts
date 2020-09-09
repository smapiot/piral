export function getImportMaps() {
  return Object.getOwnPropertySymbols(System)
    .map((sym) => System[sym])
    .filter((m) => typeof m.imports !== 'undefined')
    .map((m) => m.imports)
    .pop();
}

export function convertToMetadata(importMaps: Record<string, string>) {
  return Object.keys(importMaps).map((name) => ({
    name,
    link: importMaps[name],
  }));
}

export function appendImportMaps(importMaps: Record<string, string>) {
  const script = document.createElement('script');
  script.type = 'systemjs-importmap';
  script.textContent = JSON.stringify({
    imports: importMaps,
  });
  document.head.appendChild(script);
}
