import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { progress, logReset, log } from 'piral-cli/utils';
import { RuleSetRule, ProgressPlugin, HotModuleReplacementPlugin, optimize } from 'webpack';
import { HotModuleServerPlugin } from '../plugins/HotModuleServerPlugin';
import SheetPlugin from '../plugins/SheetPlugin';

const piletCss = 'main.css';

function getStyleLoaders(production: boolean) {
  if (production) {
    return [MiniCssExtractPlugin.loader];
  } else {
    return [require.resolve('style-loader')];
  }
}

export const extensions = ['.ts', '.tsx', '.js', '.json'];

export function getVariables(): Record<string, string> {
  return Object.keys(process.env).reduce(
    (prev, curr) => {
      prev[curr] = process.env[curr];
      return prev;
    },
    {
      DEBUG_PIRAL: '',
      DEBUG_PILET: '',
    },
  );
}

export function getHmrEntry(hmrPort: number) {
  return hmrPort ? [`webpack-hot-middleware/client?path=http://localhost:${hmrPort}/__webpack_hmr&reload=true`] : [];
}

export function getPlugins(plugins: Array<any>, production: boolean, pilet: boolean, hmrPort?: number) {
  const otherPlugins = [
    new MiniCssExtractPlugin({
      filename: pilet ? piletCss : '[name].[hash:6].css',
      chunkFilename: '[id].[hash:6].css',
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

  if (hmrPort) {
    otherPlugins.push(new HotModuleReplacementPlugin());
    otherPlugins.push(new HotModuleServerPlugin(hmrPort));
  }

  if (production) {
    otherPlugins.push(new optimize.OccurrenceOrderPlugin(true));

    if (pilet) {
      const name = process.env.BUILD_PCKG_NAME;
      otherPlugins.push(new SheetPlugin(piletCss, name));
    }
  }

  return plugins.concat(otherPlugins);
}

export function getRules(production: boolean): Array<RuleSetRule> {
  const styleLoaders = getStyleLoaders(production);
  const nodeModules = /node_modules/;
  const babelLoader = {
    loader: require.resolve('babel-loader'),
    options: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
    },
  };
  const tsLoader = {
    loader: require.resolve('ts-loader'),
    options: {
      transpileOnly: true,
    },
  };
  const fileLoader = {
    loader: require.resolve('file-loader'),
    options: {
      esModule: false,
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
          exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/i, /\.html$/i, /\.json$/i],
          use: [fileLoader],
        },
        // Don't add new loaders here -> should be added before the last (catch-all) handler
      ],
    },
    {
      parser: {
        system: false,
      },
    },
  ];
}
