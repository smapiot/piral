import { BuildOptions } from 'esbuild';
import { htmlPlugin } from '../plugins/html';
import { createCommonConfig } from './common';

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
  const config = createCommonConfig(outdir, development, sourcemap, contentHash, minify);

  if (hmr) {
    config.banner = {
      js: `(() => new WebSocket(location.origin.replace('http', 'ws')+"/$events").onmessage = () => location.reload())();`,
    };
  }

  return {
    ...config,
    entryPoints: [entryFile],
    publicPath,
    define: {
      ...config.define,
      'process.env.DEBUG_PIRAL': JSON.stringify(process.env.DEBUG_PIRAL || ''),
      'process.env.DEBUG_PILET': JSON.stringify(process.env.DEBUG_PILET || ''),
      'process.env.SHARED_DEPENDENCIES': JSON.stringify(externals.join(',')),
    },
    plugins: [...config.plugins, htmlPlugin()],
  };
}
