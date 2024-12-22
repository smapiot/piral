import * as SystemJSPublicPathWebpackPlugin from 'systemjs-webpack-interop/SystemJSPublicPathWebpackPlugin';
import type { SharedDependency } from 'piral-cli';
import { Configuration, BannerPlugin, DefinePlugin, container } from 'webpack';
import {
  setEnvironment,
  getDefineVariables,
  getVariables,
  withSetPath,
  withExternals,
  getDependencies,
  getShared,
} from './helpers';
import StylesPlugin from '../../plugins/StylesPlugin';
import SheetPlugin from '../../plugins/SheetPlugin';

const piletCss = 'main.css';

export interface PiletWebpackConfigEnhancerOptions {
  /**
   * The name of the pilet.
   */
  name: string;
  /**
   * The name of the entry module.
   */
  entry: string;
  /**
   * The version of the pilet.
   */
  version: string;
  /**
   * The name of the Piral instances.
   */
  piralInstances: Array<string>;
  /**
   * The name of the main output file.
   */
  filename: string;
  /**
   * The schema version. By default, v1 is used.
   */
  schema?: 'v0' | 'v1' | 'v2' | 'v3' | 'mf' | 'none';
  /**
   * The shared dependencies. By default, these are read from the
   * Piral instance.
   */
  externals?: Array<string>;
  /**
   * Additional environment variables to define.
   */
  variables?: Record<string, string>;
  /**
   * The shared dependencies to consider.
   */
  importmap: Array<SharedDependency>;
}

interface SchemaEnhancerOptions {
  name: string;
  entry: string;
  file: string;
  variables: Record<string, string>;
  externals: Array<string>;
  importmap: Array<SharedDependency>;
}

function piletVxWebpackConfigEnhancer(options: SchemaEnhancerOptions, compiler: Configuration) {
  const { variables, externals } = options;

  withSetPath(compiler);
  setEnvironment(variables);
  withExternals(compiler, externals);

  compiler.plugins.push(new DefinePlugin(getDefineVariables(variables)));

  return compiler;
}

function piletV0WebpackConfigEnhancer(options: SchemaEnhancerOptions, compiler: Configuration) {
  const { name, variables, externals, file, entry } = options;
  const shortName = name.replace(/\W/gi, '');
  const jsonpFunction = `pr_${shortName}`;
  const banner = `//@pilet v:0`;

  withSetPath(compiler);
  setEnvironment(variables);
  withExternals(compiler, externals);

  compiler.plugins.push(
    new SheetPlugin(piletCss, name, entry),
    new DefinePlugin(getDefineVariables(variables)),
    new BannerPlugin({
      banner,
      entryOnly: true,
      include: file,
      raw: true,
    }),
  );
  compiler.output.uniqueName = `${jsonpFunction}`;
  compiler.output.library = name;
  compiler.output.libraryTarget = 'umd';

  return compiler;
}

function piletV1WebpackConfigEnhancer(options: SchemaEnhancerOptions, compiler: Configuration) {
  const { name, variables, externals, file, entry } = options;
  const shortName = name.replace(/\W/gi, '');
  const jsonpFunction = `pr_${shortName}`;
  const banner = `//@pilet v:1(${jsonpFunction})`;

  withSetPath(compiler);
  setEnvironment(variables);
  withExternals(compiler, externals);

  compiler.plugins.push(
    new SheetPlugin(piletCss, name, entry),
    new DefinePlugin(getDefineVariables(variables)),
    new BannerPlugin({
      banner,
      entryOnly: true,
      include: file,
      raw: true,
    }),
  );
  compiler.output.uniqueName = `${jsonpFunction}`;
  compiler.output.library = name;
  compiler.output.libraryTarget = 'umd';
  compiler.output.auxiliaryComment = {
    commonjs2: `\nfunction define(d,k){(typeof document!=='undefined')&&(document.currentScript.app=k.apply(null,d.map(window.${jsonpFunction})));}define.amd=!0;`,
  };

  return compiler;
}

function piletV2WebpackConfigEnhancer(options: SchemaEnhancerOptions, compiler: Configuration) {
  const { name, variables, externals, file, importmap, entry } = options;
  const shortName = name.replace(/\W/gi, '');
  const jsonpFunction = `pr_${shortName}`;
  const plugins = [];

  withExternals(compiler, externals);
  setEnvironment(variables);

  const dependencies = getDependencies(importmap, compiler);
  const banner = `//@pilet v:2(webpackChunk${jsonpFunction},${JSON.stringify(dependencies)})`;

  plugins.push(
    new SheetPlugin(piletCss, name, entry),
    new DefinePlugin(getDefineVariables(variables)),
    new BannerPlugin({
      banner,
      entryOnly: true,
      include: file,
      raw: true,
    }),
    new SystemJSPublicPathWebpackPlugin(),
  );

  compiler.plugins = [...compiler.plugins, ...plugins];
  compiler.output.uniqueName = `${jsonpFunction}`;
  compiler.output.library = { type: 'system' };

  return compiler;
}

function piletV3WebpackConfigEnhancer(options: SchemaEnhancerOptions, compiler: Configuration) {
  const { name, variables, externals, file, importmap, entry } = options;
  const shortName = name.replace(/\W/gi, '');
  const jsonpFunction = `pr_${shortName}`;
  const plugins = [];

  withExternals(compiler, externals);
  setEnvironment(variables);

  const dependencies = getDependencies(importmap, compiler);
  const banner = `//@pilet v:3(webpackChunk${jsonpFunction},${JSON.stringify(dependencies)})`;

  plugins.push(
    new StylesPlugin(piletCss, entry),
    new DefinePlugin(getDefineVariables(variables)),
    new BannerPlugin({
      banner,
      entryOnly: true,
      include: file,
      raw: true,
    }),
  );

  compiler.output.publicPath = '';
  compiler.output.chunkFormat = 'module';
  compiler.plugins = [...compiler.plugins, ...plugins];
  compiler.output.uniqueName = `${jsonpFunction}`;
  compiler.output.library = { type: 'system' };
  compiler.target = 'node';

  return compiler;
}

function piletMfWebpackConfigEnhancer(options: SchemaEnhancerOptions, compiler: Configuration) {
  const { name, variables, externals, file, importmap, entry } = options;
  const { ModuleFederationPlugin } = container;

  setEnvironment(variables);

  const plugins = [
    new DefinePlugin(getDefineVariables(variables)),
    new ModuleFederationPlugin({
      filename: file,
      name: name.replace(/^@/, '').replace('/', '-').replace(/\-/g, '_'),
      exposes: {
        './pilet': compiler.entry[entry],
      },
      shared: getShared(importmap, externals),
    }),
  ];

  compiler.entry = {};
  compiler.output.publicPath = 'auto';
  compiler.plugins = [...compiler.plugins, ...plugins];

  return compiler;
}

export const piletWebpackConfigEnhancer = (details: PiletWebpackConfigEnhancerOptions) => (compiler: Configuration) => {
  const { externals = [], schema, importmap } = details;
  const environment = process.env.NODE_ENV || 'development';
  const options: SchemaEnhancerOptions = {
    entry: details.entry,
    externals,
    file: details.filename,
    name: details.name,
    importmap,
    variables: {
      ...getVariables(details.name, details.version, environment),
      ...details.variables,
    },
  };

  switch (schema) {
    case 'v0':
      return piletV0WebpackConfigEnhancer(options, compiler);
    case 'v1':
      return piletV1WebpackConfigEnhancer(options, compiler);
    case 'v2':
      return piletV2WebpackConfigEnhancer(options, compiler);
    case 'v3':
      return piletV3WebpackConfigEnhancer(options, compiler);
    case 'mf':
      return piletMfWebpackConfigEnhancer(options, compiler);
    case 'none':
    default:
      return piletVxWebpackConfigEnhancer(options, compiler);
  }
};
