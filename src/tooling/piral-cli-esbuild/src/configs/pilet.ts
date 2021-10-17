import { BuildOptions } from 'esbuild';
import { basename, extname } from 'path';
import { sassPlugin } from 'esbuild-sass-plugin';
import { piletPlugin } from '../plugins/pilet';
import { codegenPlugin } from '../plugins/codegen';
import type { PiletSchemaVersion, SharedDependency } from 'piral-cli';

function nameOf(path: string) {
  const file = basename(path);
  const ext = extname(file);
  return file.substr(0, file.length - ext.length);
}

export function createConfig(
  entryModule: string,
  outdir: string,
  filename: string,
  externals: Array<string>,
  importmap: Array<SharedDependency> = [],
  schema: PiletSchemaVersion,
  development = false,
  sourcemap = true,
  contentHash = true,
  minify = true,
  publicPath = '/',
): BuildOptions {
  if (schema !== 'v2') {
    throw new Error('The provided schema version is not supported. Only "v2" works with esbuild.');
  }

  const deps = JSON.stringify(
    importmap.reduce((obj, dep) => {
      obj[dep.id] = dep.ref;
      return obj;
    }, {}),
  );
  const external = [...externals, ...importmap.map(m => m.name)];
  const entryPoints = {
    [nameOf(filename)]: entryModule,
  };

  return {
    entryPoints,
    bundle: true,
    minify,
    assetNames: contentHash ? '[name]-[hash]' : '[name]',
    chunkNames: contentHash ? '[name]-[hash]' : '[name]',
    publicPath,
    sourcemap,
    splitting: true,
    external,
    format: 'esm',
    define: {
      'process.env.NODE_ENV': JSON.stringify(development ? 'development' : 'production'),
      'process.env.BUILD_PCKG_NAME': JSON.stringify(process.env.BUILD_PCKG_NAME),
      'process.env.BUILD_PCKG_VERSION': JSON.stringify(process.env.BUILD_PCKG_VERSION),
    },
    plugins: [codegenPlugin(), sassPlugin(), piletPlugin({ deps })],
    target: ['esnext'],
    outdir,
  };
}
