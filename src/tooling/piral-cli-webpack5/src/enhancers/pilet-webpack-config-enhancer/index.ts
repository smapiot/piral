import * as SystemJSPublicPathWebpackPlugin from 'systemjs-webpack-interop/SystemJSPublicPathWebpackPlugin';
import { join, resolve } from 'path';
import { Configuration, BannerPlugin, DefinePlugin, WebpackPluginInstance } from 'webpack';
import { setEnvironment, getDefineVariables, getVariables } from './helpers';

export interface PiletWebpackConfigEnhancerOptions {
  /**
   * The name of the pilet.
   */
  name: string;
  /**
   * The version of the pilet.
   */
  version: string;
  /**
   * The name of the Piral instance / app shell.
   */
  piral: string;
  /**
   * The name of the main output file.
   */
  filename: string;
  /**
   * The schema version. By default, v1 is used.
   */
  schema?: 'v0' | 'v1' | 'v2' | 'none';
  /**
   * The shared dependencies. By default, these are read from the
   * Piral instance.
   */
  externals?: Array<string>;
  /**
   * Additional environment variables to define.
   */
  variables?: Record<string, string>;
}

interface Importmap {
  imports: Record<string, string>;
}

function getExternals(piral: string) {
  const shellPkg = require(`${piral}/package.json`);
  const piralExternals = shellPkg.pilets?.externals ?? [];
  return [
    ...piralExternals,
    '@dbeining/react-atom',
    '@libre/atom',
    'history',
    'react',
    'react-dom',
    'react-router',
    'react-router-dom',
    'tslib',
    'path-to-regexp',
  ];
}

function getDependencies(compilerOptions: Configuration, importmap: Importmap) {
  const dependencies = {};
  const sharedImports = importmap?.imports;

  if (typeof compilerOptions.entry === 'object' && compilerOptions.entry && typeof sharedImports === 'object') {
    for (const depName of Object.keys(sharedImports)) {
      const basePath = require.resolve(`${depName}/package.json`);
      const details = require(basePath);
      const depId = `${depName}@${details.version}`;
      dependencies[depId] = `${depName}.js`;
      compilerOptions.externals[depName] = depId;
      compilerOptions.entry[depName] = resolve(basePath, sharedImports[depName]);
    }
  }

  return dependencies;
}

function withSetPath(compilerOptions: Configuration) {
  if (typeof compilerOptions.entry === 'object' && compilerOptions.entry) {
    const setPath = join(__dirname, '..', '..', 'set-path');

    if (Array.isArray(compilerOptions.entry)) {
      compilerOptions.entry.unshift(setPath);
    } else {
      for (const key of Object.keys(compilerOptions.entry)) {
        const entry = compilerOptions.entry[key];

        if (Array.isArray(entry)) {
          entry.unshift(setPath);
        }
      }
    }
  }
}

function withExternals(compilerOptions: Configuration, externals: Array<string>) {
  const current = compilerOptions.externals;
  const newExternals = Array.isArray(current)
    ? [...(current as Array<string>), ...externals]
    : typeof current === 'string'
    ? [current, ...externals]
    : externals;

  if (newExternals !== externals || typeof compilerOptions.externals !== 'object' || !compilerOptions.externals) {
    compilerOptions.externals = {};
  }

  for (const external of newExternals) {
    if (typeof external === 'string') {
      compilerOptions.externals[external] = external;
    }
  }
}

function piletVxWebpackConfigEnhancer(
  _name: string,
  _file: string,
  variables: Record<string, string>,
  externals: Array<string>,
  compilerOptions: Configuration,
) {
  const plugins: Array<WebpackPluginInstance> = [new DefinePlugin(getDefineVariables(variables))];

  withSetPath(compilerOptions);
  setEnvironment(variables);

  compilerOptions.plugins = [...compilerOptions.plugins, ...plugins];

  withExternals(compilerOptions, externals);

  return compilerOptions;
}

function piletV1WebpackConfigEnhancer(
  name: string,
  file: string,
  variables: Record<string, string>,
  externals: Array<string>,
  compilerOptions: Configuration,
) {
  const shortName = name.replace(/\W/gi, '');
  const jsonpFunction = `pr_${shortName}`;
  const plugins: Array<WebpackPluginInstance> = [new DefinePlugin(getDefineVariables(variables))];

  withSetPath(compilerOptions);

  plugins.push(
    new BannerPlugin({
      banner: `//@pilet v:1(${jsonpFunction})`,
      entryOnly: true,
      include: file,
      raw: true,
    }),
  );

  setEnvironment(variables);

  compilerOptions.plugins = [...compilerOptions.plugins, ...plugins];
  compilerOptions.output.uniqueName = `${jsonpFunction}`;
  compilerOptions.output.library = name;
  compilerOptions.output.libraryTarget = 'umd';

  const reset = `delete window.webpackChunk${jsonpFunction};`;
  compilerOptions.output.auxiliaryComment = {
    commonjs2: `\nfunction define(d,k){${reset}(typeof document!=='undefined')&&(document.currentScript.app=k.apply(null,d.map(window.${jsonpFunction})));}define.amd=!0;`,
  } as any;

  withExternals(compilerOptions, externals);

  return compilerOptions;
}

function piletV2WebpackConfigEnhancer(
  _name: string,
  file: string,
  variables: Record<string, string>,
  externals: Array<string>,
  compilerOptions: Configuration,
) {
  const packageDetails = require(resolve(process.cwd(), 'package.json'));
  const plugins: Array<WebpackPluginInstance> = [new DefinePlugin(getDefineVariables(variables))];

  withExternals(compilerOptions, externals);

  const dependencies = getDependencies(compilerOptions, packageDetails.importmap);

  plugins.push(
    new BannerPlugin({
      banner: `//@pilet v:2(${JSON.stringify(dependencies)})`,
      entryOnly: true,
      include: file,
      raw: true,
    }),
    new SystemJSPublicPathWebpackPlugin(),
  );

  setEnvironment(variables);

  compilerOptions.plugins = [...compilerOptions.plugins, ...plugins];
  compilerOptions.output.libraryTarget = 'system';

  return compilerOptions;
}

export const piletWebpackConfigEnhancer =
  (options: PiletWebpackConfigEnhancerOptions) => (compilerOptions: Configuration) => {
    const { name, version, piral, externals = getExternals(piral), schema, filename } = options;
    const environment = process.env.NODE_ENV || 'development';
    const variables = {
      ...getVariables(name, version, environment),
      ...options.variables,
    };

    switch (schema) {
      case 'v1':
        return piletV1WebpackConfigEnhancer(name, filename, variables, externals, compilerOptions);
      case 'v2':
        return piletV2WebpackConfigEnhancer(name, filename, variables, externals, compilerOptions);
      case 'v0':
      case 'none':
      default:
        return piletVxWebpackConfigEnhancer(name, filename, variables, externals, compilerOptions);
    }
  };
