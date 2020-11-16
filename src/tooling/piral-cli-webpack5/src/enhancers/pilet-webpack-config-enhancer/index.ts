import { BannerPlugin, DefinePlugin, WebpackPluginInstance } from 'webpack';
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
   * The schema version. By default, v1 is used.
   */
  schema?: 'v0' | 'v1' | 'none';
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

export const piletWebpackConfigEnhancer = (options: PiletWebpackConfigEnhancerOptions) => (compilerOptions) => {
  const environment = process.env.NODE_ENV || 'development';
  const { name, version, piral, externals = getExternals(piral), schema } = options;
  const shortName = name.replace(/\W/gi, '');
  const jsonpFunction = `pr_${shortName}`;
  const variables = {
    ...getVariables(name, version, environment),
    ...options.variables,
  };
  const plugins: WebpackPluginInstance[] = [new DefinePlugin(getDefineVariables(variables))];

  if (schema !== 'none') {
    const bannerSuffix = schema ? `1(${jsonpFunction})` : `0`;

    plugins.push(
      new BannerPlugin({
        banner: `//@pilet v:${bannerSuffix}`,
        entryOnly: true,
        include: /\.js$/,
        raw: true,
      }),
    );
  }

  // FIXME: this is a really bad idea, making finding the source of configuration nearly impossible
  setEnvironment(variables);

  // plugins.forEach((plugin) => plugin.apply(compiler));
  compilerOptions.plugins = [...compilerOptions.plugins, ...plugins];

  const current = compilerOptions.externals;
  compilerOptions.output.uniqueName = `${jsonpFunction}`;
  compilerOptions.output.library = name;

  if (schema !== 'none') {
    compilerOptions.output.libraryTarget = 'umd';
  }

  if (schema === 'v1') {
    const reset = environment !== 'production' ? `delete ${jsonpFunction}_chunks;` : '';
    compilerOptions.output.auxiliaryComment = {
      commonjs2: `\nfunction define(d,k){${reset}(typeof document!=='undefined')&&(document.currentScript.app=k.apply(null,d.map(window.${jsonpFunction})));}define.amd=!0;`,
      //   commonjs2: `\nfunction define(d,k){${reset}(typeof document!=='undefined')&&(document.currentScript.app=k.apply(null,d.map(x=>x)));}define.amd=!0;`,
    } as any;
  }

  compilerOptions.externals = Array.isArray(current)
    ? [...current, ...externals]
    : current
    ? [current, ...externals]
    : externals;

  console.log(compilerOptions);

  return compilerOptions;
};
