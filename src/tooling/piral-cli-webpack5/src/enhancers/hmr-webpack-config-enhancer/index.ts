import { HotModuleReplacementPlugin, Configuration } from 'webpack';
import { HotModuleServerPlugin } from './HotModuleServerPlugin';

export interface HmrWebpackPluginOptions {
  port: number;
}

function getHmrEntry(hmrPort: number): [] | [string] {
  return hmrPort
    ? [
        `piral-cli-webpack5/src/webpack-hot-middleware/client?path=http://localhost:${hmrPort}/__webpack_hmr&reload=true`,
      ]
    : [];
}

export const hmrWebpackConfigEnhancer = (options: HmrWebpackPluginOptions) => (compilerOptions: Configuration) => {
  const { port } = options;

  if (port) {
    if (Array.isArray(compilerOptions.entry)) {
      compilerOptions.entry.unshift(...getHmrEntry(port));
    }

    const newPlugins = [new HotModuleReplacementPlugin(), new HotModuleServerPlugin(port)];

    if (!compilerOptions.plugins) {
      compilerOptions.plugins = newPlugins;
    } else if (Array.isArray(compilerOptions.plugins)) {
      compilerOptions.plugins.push(...newPlugins);
    }
  }

  return compilerOptions;
};
