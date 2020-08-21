import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { resolve } from 'path';
import { progress, logReset, log } from 'piral-cli/utils';
import { RuleSetRule, ProgressPlugin, HotModuleReplacementPlugin, optimize } from 'webpack';
import { HotModuleServerPlugin } from './HotModuleServerPlugin';

function getStyleLoaders(production: boolean, pilet: boolean) {
  if (production && pilet) {
    return [require.resolve('./SheetLoader'), MiniCssExtractPlugin.loader];
  } else if (production) {
    return [MiniCssExtractPlugin.loader];
  } else {
    return ['style-loader'];
  }
}

export const extensions = ['.ts', '.tsx', '.js', '.json'];

export function getVariables(): Record<string, string> {
  return Object.keys(process.env).reduce((prev, curr) => {
    prev[curr] = process.env[curr];
    return prev;
  }, {});
}

export function getHmrEntry(hmrPort: number) {
  return hmrPort ? [`webpack-hot-middleware/client?path=http://localhost:${hmrPort}/__webpack_hmr&reload=true`] : [];
}

export function getPlugins(plugins: Array<any>, showProgress: boolean, production: boolean, hmrPort?: number) {
  const otherPlugins = [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ];

  if (showProgress) {
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
  }

  return plugins.concat(otherPlugins);
}

export function getRules(baseDir: string, production: boolean, pilet: boolean): Array<RuleSetRule> {
  const styleLoaders = getStyleLoaders(production, pilet);
  const nodeModules = resolve(baseDir, 'node_modules');
  const babelLoader = {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
    },
  };
  const tsLoader = {
    loader: 'ts-loader',
    options: {
      transpileOnly: true,
    },
  };
  const fileLoader = {
    loader: 'file-loader',
    options: {
      esModule: false,
    },
  };

  return [
    {
      test: /\.(png|jpe?g|gif|bmp|avi|mp4|mp3|svg|ogg|webp|woff2?|eot|ttf|wav)$/i,
      use: [fileLoader],
    },
    {
      test: /\.s[ac]ss$/i,
      use: [...styleLoaders, 'css-loader', 'sass-loader'],
    },
    {
      test: /\.css$/i,
      use: [...styleLoaders, 'css-loader'],
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
      use: ['parcel-codegen-loader'],
    },
    {
      test: /\.js$/i,
      use: ['source-map-loader'],
      exclude: nodeModules,
      enforce: 'pre',
    },
  ];
}
