import * as SystemJSPublicPathWebpackPlugin from 'systemjs-webpack-interop/SystemJSPublicPathWebpackPlugin';
import { join, resolve } from 'path';
import { Configuration, BannerPlugin, DefinePlugin } from 'webpack';
import { setEnvironment, getDefineVariables, getVariables } from './helpers';

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

interface SchemaEnhancerOptions {
  name: string;
  entry: string;
  file: string;
  variables: Record<string, string>;
  externals: Array<string>;
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
      const details = require(`${depName}/package.json`);
      const depId = `${depName}@${details.version}`;
      dependencies[depId] = `${depName}.js`;
      compilerOptions.externals[depName] = depId;
      compilerOptions.entry[depName] = resolve(process.cwd(), sharedImports[depName]);
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

function piletVxWebpackConfigEnhancer(options: SchemaEnhancerOptions, compiler: Configuration) {
  const { variables, externals } = options;

  withSetPath(compiler);
  setEnvironment(variables);

  compiler.plugins.push(new DefinePlugin(getDefineVariables(variables)));

  withExternals(compiler, externals);

  return compiler;
}

function piletV1WebpackConfigEnhancer(options: SchemaEnhancerOptions, compiler: Configuration) {
  const { name, variables, externals, file } = options;
  const shortName = name.replace(/\W/gi, '');
  const jsonpFunction = `pr_${shortName}`;

  withSetPath(compiler);

  setEnvironment(variables);

  compiler.plugins.push(
    new DefinePlugin(getDefineVariables(variables)),
    new BannerPlugin({
      banner: `//@pilet v:1(${jsonpFunction})`,
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

  withExternals(compiler, externals);

  return compiler;
}

function piletV2WebpackConfigEnhancer(options: SchemaEnhancerOptions, compiler: Configuration) {
  const { name, variables, externals, file } = options;
  const shortName = name.replace(/\W/gi, '');
  const jsonpFunction = `pr_${shortName}`;
  const packageDetails = require(resolve(process.cwd(), 'package.json'));

  withExternals(compiler, externals);

  const dependencies = getDependencies(compiler, packageDetails.importmap);
  const plugins = [];

  plugins.push(
    new DefinePlugin(getDefineVariables(variables)),
    new BannerPlugin({
      banner: `//@pilet v:2(webpackChunk${jsonpFunction},${JSON.stringify(dependencies)})`,
      entryOnly: true,
      include: file,
      raw: true,
    }),
    new SystemJSPublicPathWebpackPlugin(),
  );

  setEnvironment(variables);

  compiler.plugins = [...compiler.plugins, ...plugins];
  compiler.module.rules.push({ parser: { system: false } });
  compiler.output.uniqueName = `${jsonpFunction}`;
  compiler.output.library = { type: 'system' };

  return compiler;
}

export const piletWebpackConfigEnhancer = (details: PiletWebpackConfigEnhancerOptions) => (compiler: Configuration) => {
  const { piral, externals = getExternals(piral), schema } = details;
  const environment = process.env.NODE_ENV || 'development';
  const options: SchemaEnhancerOptions = {
    entry: details.entry,
    externals,
    file: details.filename,
    name: details.name,
    variables: {
      ...getVariables(details.name, details.version, environment),
      ...details.variables,
    },
  };

  switch (schema) {
    case 'v1':
      return piletV1WebpackConfigEnhancer(options, compiler);
    case 'v2':
      return piletV2WebpackConfigEnhancer(options, compiler);
    case 'v0':
    case 'none':
    default:
      return piletVxWebpackConfigEnhancer(options, compiler);
  }
};
