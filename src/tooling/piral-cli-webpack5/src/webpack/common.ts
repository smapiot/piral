import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { progress, logReset, log } from 'piral-cli/utils';
import { RuleSetRule, ProgressPlugin, WebpackPluginInstance, Configuration } from 'webpack';

const piletCss = 'main.css';

export function getStyleLoaders(useExtractLoader: boolean) {
  if (useExtractLoader) {
    return [MiniCssExtractPlugin.loader];
  } else {
    return [require.resolve('style-loader')];
  }
}

export type ConfigEnhancer = (config: Configuration) => Configuration;

export type DefaultConfiguration = [Configuration, ConfigEnhancer];

export const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];

export function getVariables(): Record<string, string> {
  return Object.keys(process.env).reduce((prev, curr) => {
    prev[curr] = process.env[curr];
    return prev;
  }, {});
}

export function getPlugins(plugins: Array<WebpackPluginInstance>, pilet?: string) {
  const otherPlugins: Array<WebpackPluginInstance> = [
    new MiniCssExtractPlugin({
      filename: pilet ? piletCss : '[name].[fullhash:6].css',
      chunkFilename: '[id].[chunkhash:6].css',
    }),
  ];

  if (process.env.WEBPACK_PROGRESS) {
    otherPlugins.push(
      new ProgressPlugin((percent, msg) => {
        if (percent !== undefined) {
          progress(`${~~(percent * 100)}% : ${msg}`);

          if (percent === 1) {
            logReset();
            log('generalInfo_0000', 'Bundling finished.');
          }
        }
      }),
    );
  }

  return plugins.concat(otherPlugins);
}

export function getRules(styleLoaders: Array<string>): Array<RuleSetRule> {
  const nodeModules = /node_modules/;
  const babelLoader = {
    loader: require.resolve('babel-loader'),
    options: {
      presets: [require.resolve('@babel/preset-env'), require.resolve('@babel/preset-react')],
    },
  };
  const tsLoader = {
    loader: require.resolve('ts-loader'),
    options: {
      transpileOnly: true,
    },
  };

  return [
    {
      oneOf: [
        {
          test: /\.s[ac]ss$/i,
          use: [...styleLoaders, require.resolve('css-loader'), require.resolve('sass-loader')],
        },
        {
          test: /\.css$/i,
          use: [...styleLoaders, require.resolve('css-loader')],
        },
        {
          test: /\.m?jsx?$/i,
          use: [babelLoader],
          exclude: nodeModules,
        },
        {
          test: /\.tsx?$/i,
          use: [babelLoader, tsLoader],
        },
        {
          test: /\.codegen$/i,
          use: [require.resolve('parcel-codegen-loader')],
        },
        {
          test: /\.js$/i,
          use: [require.resolve('source-map-loader')],
          exclude: nodeModules,
          enforce: 'pre',
        },
        {
          // Exclude `js` files to keep "css" loader working as it injects
          // its runtime that would otherwise be processed through "file" loader.
          // Also exclude `html` and `json` extensions so they get processed
          // by webpacks internal loaders.
          exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx|vue|svelte|elm)$/i, /\.html$/i, /\.json$/i],
          type: 'asset/resource',
        },
        // Don't add new loaders here -> should be added before the last (catch-all) handler
      ],
    },
  ];
}
