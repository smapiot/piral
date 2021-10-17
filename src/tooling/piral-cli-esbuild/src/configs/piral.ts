import { BuildOptions } from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import { htmlPlugin } from '../plugins/html';
import { codegenPlugin } from '../plugins/codegen';

export function createConfig(
  entryFile: string,
  outdir: string,
  externals: Array<string>,
  development: boolean,
  sourcemap: boolean,
  contentHash: boolean,
  minify: boolean,
  publicPath: string,
  hmr = false,
): BuildOptions {
  //TODO use hmr
  return {
    entryPoints: [entryFile],
    bundle: true,
    publicPath,
    minify,
    assetNames: contentHash ? '[name]-[hash]' : '[name]',
    chunkNames: contentHash ? '[name]-[hash]' : '[name]',
    sourcemap,
    define: {
      'process.env.NODE_ENV': JSON.stringify(development ? 'development' : 'production'),
      'process.env.DEBUG_PIRAL': JSON.stringify(process.env.DEBUG_PIRAL || ''),
      'process.env.DEBUG_PILET': JSON.stringify(process.env.DEBUG_PILET || ''),
      'process.env.SHARED_DEPENDENCIES': JSON.stringify(externals.join(',')),
      'process.env.BUILD_PCKG_NAME': JSON.stringify(process.env.BUILD_PCKG_NAME),
      'process.env.BUILD_PCKG_VERSION': JSON.stringify(process.env.BUILD_PCKG_VERSION),
    },
    plugins: [codegenPlugin(), sassPlugin(), htmlPlugin()],
    target: ['esnext'],
    outdir,
  };
}
