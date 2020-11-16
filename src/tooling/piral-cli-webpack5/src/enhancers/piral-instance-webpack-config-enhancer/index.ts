import { DefinePlugin } from 'webpack';
import { setEnvironment, getDefineVariables, getVariables } from './helpers';

export interface PiralInstanceWebpackPluginOptions {
  name: string;
  version: string;
  externals: Array<string>;
  variables?: Record<string, boolean | string>;
  debug?: boolean | string;
  emulator?: boolean | string;
}

export const piralInstanceWebpackConfigEnhancer = (options: PiralInstanceWebpackPluginOptions) => (compilerOptions) => {
  const { name, version, debug, emulator, externals } = options;
  const environment = process.env.NODE_ENV || 'development';
  const variables = {
    ...getVariables(name, version, externals, environment),
    ...options.variables,
  };

  variables.DEBUG_PIRAL = debug === true ? '1.0' : debug;
  variables.DEBUG_PILET = emulator === true ? '/$pilet-api' : emulator;

  const plugins = [new DefinePlugin(getDefineVariables(variables))];

  setEnvironment(variables);

  compilerOptions.plugins = [...(compilerOptions.plugins || []), ...plugins];

  return compilerOptions;
};
