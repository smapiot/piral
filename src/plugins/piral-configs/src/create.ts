import { Extend } from 'piral-core';
import { Validator, Schema } from 'jsonschema';
import { PiletConfigsApi } from './types';

/**
 * Available configuration options for the configs plugin.
 */
export interface ConfigsConfig {
  /**
   * Sets the retriever function for getting the app or user configuration.
   * @default undefined
   */
  retrieve?<T>(configName: string): T | undefined;
}

export function createConfigsApi(config: ConfigsConfig = {}): Extend<PiletConfigsApi> {
  const readConfig = (name: string, defaultConfig: any) => {
    const key = `config-${name}`;
    const current = config.retrieve?.(key);

    if (typeof current === 'object') {
      return {
        ...defaultConfig,
        ...current,
      };
    } else if (typeof current !== 'undefined') {
      return current;
    } else {
      return undefined;
    }
  };

  const validate = (schema: Schema, proposedConfig: any, defaultConfig: any) => {
    const validator = new Validator();
    const result = validator.validate(proposedConfig, schema);

    if (!result.valid) {
      console.warn(
        `The given configuration does not match the provided schema. Taking the default configuration.`,
        proposedConfig,
        result,
      );
      return defaultConfig;
    }

    return proposedConfig;
  };

  return ctx => (_, meta) => ({
    defineConfigSchema(schema, defaultConfig) {
      const proposedConfig = readConfig(meta.name, defaultConfig);
      const current = validate(schema, proposedConfig, defaultConfig);

      ctx.dispatch(state => ({
        ...state,
        configs: {
          ...state.configs,
          [meta.name]: current,
        },
      }));
    },
    getCurrentConfig() {
      return ctx.readState(s => s.configs[meta.name]) ?? {};
    },
  });
}
