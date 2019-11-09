const dtsExp = /\.d\.ts$/;
const bomOptExp = /^\uFEFF?/;

const externalExp = /^([ \t]*declare module )(['"])(.+?)(\2[ \t]*{?.*)$/;
const importExp = /^([ \t]*(?:export )?(?:import .+? )= require\()(['"])(.+?)(\2\);.*)$/;
const importEs6Exp = /^([ \t]*(?:export|import) ?(?:(?:\* (?:as [^ ,]+)?)|.*)?,? ?(?:[^ ,]+ ?,?)(?:\{(?:[^ ,]+ ?,?)*\})? ?from )(['"])([^ ,]+)(\2;.*)$/;
const referenceTagExp = /^[ \t]*\/\/\/[ \t]*<reference[ \t]+path=(["'])(.*?)\1?[ \t]*\/>.*$/;
const identifierExp = /^\w+(?:[\.-]\w+)*$/;
const fileExp = /^([\./].*|.:.*)$/;
const privateExp = /^[ \t]*(?:static )?private (?:static )?/;
const publicExp = /^([ \t]*)(static |)(public |)(static |)(.*)/;

export function combineApiDeclarations(root: string, dependencyNames: Array<string>) {
  const names = [root, ...dependencyNames];
  const paths: Array<string> = [];

  for (const name of names) {
    try {
      const path = require.resolve(`${name}/api.d.ts`);
      paths.push(path);
    } catch {}
  }

  return paths.map(path => `export * from '${path}';`).join('\n');
}

export async function declarationFlatting(outDir: string, fileName: string, appName: string) {
  //TODO traverse!
}
