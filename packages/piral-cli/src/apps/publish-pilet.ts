import { postFile, readBinary } from './common';

export interface PublishPiletOptions {
  source?: string;
  url?: string;
  apiKey?: string;
}

export const publishPiletDefaults = {
  source: '*.tgz',
  url: 'https://sample.piral.io/api/v1/pilet',
  apiKey: '',
};

export async function publishPilet(baseDir = process.cwd(), options: PublishPiletOptions = {}) {
  const {
    source = publishPiletDefaults.source,
    url = publishPiletDefaults.url,
    apiKey = publishPiletDefaults.apiKey,
  } = options;
  //perform glob in baseDir against source
  //const root = resolve(baseDir, source);

  // if multiple files hit --> error
  // if no file hits --> error

  const content = await readBinary(baseDir, source);

  if (!content) {
    return console.error(`No file found at ${source}.`);
  }

  await postFile(url, apiKey, content);
  //TODO
}
