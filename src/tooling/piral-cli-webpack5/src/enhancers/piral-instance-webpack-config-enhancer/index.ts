import { Configuration, DefinePlugin } from 'webpack';
import { setEnvironment, getDefineVariables, getVariables } from './helpers';

export interface PiralInstanceWebpackPluginOptions {
  name: string;
  version: string;
  externals: Array<string>;
  variables?: Record<string, boolean | string>;
}

export const piralInstanceWebpackConfigEnhancer =
  (options: PiralInstanceWebpackPluginOptions) => (compilerOptions: Configuration) => {
    const { name, version, externals } = options;
    const environment = process.env.NODE_ENV || 'development';
    const variables = {
      ...getVariables(name, version, externals, environment),
      ...options.variables,
    };

    const plugins = [new DefinePlugin(getDefineVariables(variables))];

    setEnvironment(variables);

    compilerOptions.plugins = [...(compilerOptions.plugins || []), ...plugins];

    return compilerOptions;
  };
