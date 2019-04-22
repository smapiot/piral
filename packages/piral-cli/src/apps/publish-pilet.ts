import { relative } from 'path';
import { postFile, readBinary, matchFiles } from './common';

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
  const files = await matchFiles(baseDir, source);

  if (files.length === 0) {
    return console.error(`No files found at '${source}'.`);
  }

  for (const file of files) {
    const fileName = relative(baseDir, file);
    const content = await readBinary(baseDir, fileName);

    if (!content) {
      console.warn(`Content of '${fileName}' cannot be read.`);
      continue;
    }

    console.log(`Publishing '${file}' to '${url}' ...`);

    try {
      const result = await postFile(url, apiKey, content);

      if (result) {
        console.log(`Uploaded successfully!`);
      } else {
        console.warn(`Failed to upload!`);
      }
    } catch (e) {
      return console.error(e);
    }
  }

  console.log('All done!');
}
