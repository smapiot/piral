import { relative, join } from 'path';
import { postFile, readBinary, matchFiles, createPiletPackage } from './common';
import { buildPilet } from './build-pilet';

export interface PublishPiletOptions {
  source?: string;
  url?: string;
  apiKey?: string;
  fresh?: boolean;
}

export const publishPiletDefaults = {
  source: '*.tgz',
  url: '',
  apiKey: '',
  fresh: false,
};

async function getFiles(baseDir: string, source: string, fresh: boolean) {
  if (fresh) {
    const details = require(join(baseDir, 'package.json'));
    await buildPilet(baseDir, {
      target: details.main,
    });
    const file = await createPiletPackage(baseDir, '.', '.');
    return [file];
  }

  return await matchFiles(baseDir, source);
}

export async function publishPilet(baseDir = process.cwd(), options: PublishPiletOptions = {}) {
  const {
    source = publishPiletDefaults.source,
    url = publishPiletDefaults.url,
    apiKey = publishPiletDefaults.apiKey,
    fresh = publishPiletDefaults.fresh,
  } = options;
  const files = await getFiles(baseDir, source, fresh);

  if (!url) {
    console.warn(`Missing URL of the pilet feed!`);
    throw new Error('Incomplete configuration.');
  }

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
    const result = await postFile(url, apiKey, content);

    if (result) {
      console.log(`Uploaded successfully!`);
    } else {
      console.warn(`Failed to upload!`);
      throw new Error('Could not upload.');
    }
  }

  console.log('All done!');
}
