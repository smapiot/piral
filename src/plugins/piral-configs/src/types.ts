import { Dict } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletConfigsApi {}

  interface PiralCustomState {
    /**
     * The relevant state for the available configurations.
     */
    configs: Dict<any>;
  }
}

export type JsonSchemaTypeName = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'null';
export type JsonSchemaType = Array<JsonSchemaArray> | boolean | number | null | object | string;
export type JsonSchemaArray = Array<JsonSchemaType>;
export type JsonSchema7Definition = JsonSchema | boolean;

export interface JsonSchema {
  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1
   */
  type?: JsonSchemaTypeName | Array<JsonSchemaTypeName>;
  enum?: Array<JsonSchemaType>;
  const?: JsonSchemaType;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.2
   */
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.3
   */
  maxLength?: number;
  minLength?: number;
  pattern?: string;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.4
   */
  items?: JsonSchema7Definition | Array<JsonSchema7Definition>;
  additionalItems?: JsonSchema7Definition;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  contains?: JsonSchema;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.5
   */
  maxProperties?: number;
  minProperties?: number;
  required?: Array<string>;
  properties?: {
    [key: string]: JsonSchema7Definition;
  };
  patternProperties?: {
    [key: string]: JsonSchema7Definition;
  };
  additionalProperties?: JsonSchema7Definition;
  dependencies?: {
    [key: string]: JsonSchema7Definition | Array<string>;
  };
  propertyNames?: JsonSchema7Definition;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.6
   */
  if?: JsonSchema7Definition;
  then?: JsonSchema7Definition;
  else?: JsonSchema7Definition;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.7
   */
  allOf?: Array<JsonSchema7Definition>;
  anyOf?: Array<JsonSchema7Definition>;
  oneOf?: Array<JsonSchema7Definition>;
  not?: JsonSchema7Definition;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-7
   */
  format?: string;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-8
   */
  contentMediaType?: string;
  contentEncoding?: string;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-9
   */
  definitions?: {
    [key: string]: JsonSchema7Definition;
  };

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-10
   */
  title?: string;
  description?: string;
  default?: JsonSchemaType;
  readOnly?: boolean;
  writeOnly?: boolean;
  examples?: JsonSchemaType;
}

/**
 * Defines the provided set of Pilet API extensions for configuration.
 */
export interface PiletConfigsApi {
  /**
   * Defines the available configuration options for the pilet.
   * @param schema The schema to use for allowing configurations.
   * @param defaultConfig The default configuration to use.
   */
  defineConfigSchema<T = any>(schema: JsonSchema, defaultConfig?: T): void;
  /**
   * Gets the currently available configuration.
   */
  getCurrentConfig<T = any>(): T;
}
