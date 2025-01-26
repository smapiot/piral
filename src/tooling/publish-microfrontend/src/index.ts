#!/usr/bin/env node

import * as yargs from 'yargs';
import rc from 'rc';
import { fromKeys, publishModeKeys } from 'piral-cli/src/helpers';
import { basename } from 'path';
import { readFile } from 'fs/promises';
import { progress, fail, logDone, logFail, logInfo } from './log';
import { getCa, getFiles } from './utils';
import { getAgent, postFile } from './http';

const current = process.cwd();
const defaultArgs = rc('microfrontend', {
  url: undefined,
  apiKey: undefined,
  cert: undefined,
  allowSelfSigned: false,
  mode: 'basic',
  from: 'local',
  fields: {},
  headers: {},
  interactive: false,
});

const args = yargs
  .string('source')
  .describe('source', 'Sets the source of either the previously packed *.tgz bundle or the directory to publish.')
  .default('source', current)
  .string('url')
  .describe('url', 'Sets the explicit URL where to publish the micro frontend to.')
  .default('url', defaultArgs.url)
  .string('api-key')
  .describe('api-key', 'Sets the potential API key to send to the service.')
  .default('api-key', defaultArgs.apiKey)
  .string('cert')
  .describe('cert', 'Sets a custom certificate authority to use, if any.')
  .default('cert', defaultArgs.cert)
  .boolean('allow-self-signed')
  .describe('allow-self-signed', 'Indicates that self-signed certificates should be allowed.')
  .default('allow-self-signed', defaultArgs.allowSelfSigned)
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

async function run() {
  const {
    cert,
    source,
    from,
    url,
    'api-key': apiKey,
    'allow-self-signed': allowSelfSigned,
    headers,
    fields,
    interactive,
    mode,
  } = args;
  const sources = Array.isArray(source) ? source : [source];
  const ca = await getCa(cert);
  const agent = getAgent({ ca, allowSelfSigned });
  const files = await getFiles(current, sources, from, agent);
  const successfulUploads: Array<string> = [];

  if (files.length === 0) {
    fail('No micro frontends for publishing found: %s.', sources.join(', '));
  }

  for (const file of files) {
    const fileName = basename(file);
    const content = await readFile(file);

    if (content) {
      progress(`Publishing "%s" ...`, file, url);

      const { success, status, response } = await postFile(
        url,
        mode,
        apiKey,
        content,
        fields,
        headers,
        agent,
        interactive,
      );

      const result = typeof response !== 'string' ? JSON.stringify(response, undefined, 2) : response;

      if (success) {
        successfulUploads.push(file);

        if (response) {
          logInfo('Response from server: %s', result);
        }

        progress(`Published successfully!`);
      } else if (status === 402) {
        logFail('Payment required to upload the micro frontend: %s', result);
      } else if (status === 409) {
        logFail('Version of the micro frontend already exists: %s"', result);
      } else if (status === 413) {
        logFail('Size too large for uploading the micro frontend: %s"', result);
      } else {
        logFail('Failed to upload micro frontend "%s".', fileName);
      }
    } else {
      logFail('Failed to read Micro Frontend.');
    }
  }

  if (files.length === successfulUploads.length) {
    logDone(`The micro frontends have been published successfully!`);
  } else {
    fail('Failed to publish the micro frontends.');
  }
}

run();
