#!/usr/bin/env node

import { fromKeys, publishModeKeys } from 'piral-cli/src/helpers';
import * as yargs from 'yargs';

const defaultArgs = {
  url: undefined,
  apiKey: undefined,
  cert: undefined,
  mode: 'basic',
  from: 'local',
  fields: {},
  headers: {},
  interactive: false,
};

const args = yargs
  .positional('source', {
    type: 'string',
    describe: 'Sets the source of either the previously packed *.tgz bundle or the directory to publish.',
  })
  .string('url')
  .describe('url', 'Sets the explicit URL where to publish the micro frontend to.')
  .default('url', defaultArgs.url)
  .string('api-key')
  .describe('api-key', 'Sets the potential API key to send to the service.')
  .default('api-key', defaultArgs.apiKey)
  .string('ca-cert')
  .describe('ca-cert', 'Sets a custom certificate authority to use, if any.')
  .default('ca-cert', defaultArgs.cert)
  .choices('mode', publishModeKeys)
  .describe('mode', 'Sets the authorization mode to use.')
  .default('mode', defaultArgs.mode)
  .alias('mode', 'auth-mode')
  .choices('from', fromKeys)
  .describe('from', 'Sets the type of the source to use for publishing.')
  .default('from', defaultArgs.from)
  .option('fields', undefined)
  .describe('fields', 'Sets additional fields to be included in the feed service request.')
  .default('fields', defaultArgs.fields)
  .option('headers', undefined)
  .describe('headers', 'Sets additional headers to be included in the feed service request.')
  .default('headers', defaultArgs.headers)
  .boolean('interactive')
  .describe('interactive', 'Defines if authorization tokens can be retrieved interactively.')
  .default('interactive', defaultArgs.interactive).argv;

console.log('First release.', args.source);
