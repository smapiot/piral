import { BuildOptions } from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import { codegenPlugin } from '../plugins/codegen';

export function createCommonConfig(
  outdir: string,
  development = false,
  sourcemap = true,
  contentHash = true,
  minify = true,
): BuildOptions {
  return {
    bundle: true,
    minify,
    assetNames: contentHash ? '[name]-[hash]' : '[name]',
    chunkNames: contentHash ? '[name]-[hash]' : '[name]',
    publicPath: './',
    charset: 'utf8',
    sourcemap,
    loader: {
      '.png': 'file',
      '.svg': 'file',
      '.jpg': 'file',
      '.jpeg': 'file',
      '.mp4': 'file',
      '.mp3': 'file',
      '.ogg': 'file',
      '.wav': 'file',
      '.ogv': 'file',
      '.wasm': 'file',
      '.gif': 'file',
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(development ? 'development' : 'production'),
      'process.env.BUILD_PCKG_NAME': JSON.stringify(process.env.BUILD_PCKG_NAME),
      'process.env.BUILD_PCKG_VERSION': JSON.stringify(process.env.BUILD_PCKG_VERSION),
      'process.env.PIRAL_CLI_VERSION': JSON.stringify(process.env.PIRAL_CLI_VERSION),
      'process.env.BUILD_TIME_FULL': JSON.stringify(process.env.BUILD_TIME_FULL),
    },
    plugins: [sassPlugin(), codegenPlugin()],
    target: ['esnext'],
    outdir,
  };
}
