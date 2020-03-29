import { relative, join } from 'path';
import { buildPilet } from './build-pilet';
import { LogLevels } from '../types';
import {
  postFile,
  readBinary,
  matchFiles,
  createPiletPackage,
  logDone,
  fail,
  setLogLevel,
  progress,
  log,
} from '../common';

export interface PublishPiletOptions {
  source?: string;
  url?: string;
  apiKey?: string;
  logLevel?: LogLevels;
  fresh?: boolean;
}

export const publishPiletDefaults: PublishPiletOptions = {
  source: '*.tgz',
  url: '',
  apiKey: '',
  fresh: false,
  logLevel: LogLevels.info,
};

async function getFiles(baseDir: string, source: string, fresh: boolean) {
  if (fresh) {
    log('generalDebug_0003', 'Found fresh flag. Trying to resolve the package.json.');
    const details = require(join(baseDir, 'package.json'));
    progress('Triggering pilet build ...');
    await buildPilet(baseDir, {
      target: details.main,
      fresh,
    });
    log('generalDebug_0003', 'Successfully built.');
    progress('Triggering pilet pack ...');
    const file = await createPiletPackage(baseDir, '.', '.');
    log('generalDebug_0003', 'Successfully packed.');
    return [file];
  } else {
    log('generalDebug_0003', 'Did not find fresh flag. Trying to match files.');
    return await matchFiles(baseDir, source);
  }
}

export async function publishPilet(baseDir = process.cwd(), options: PublishPiletOptions = {}) {
  const {
    source = publishPiletDefaults.source,
    url = publishPiletDefaults.url,
    apiKey = publishPiletDefaults.apiKey,
    fresh = publishPiletDefaults.fresh,
    logLevel = publishPiletDefaults.logLevel,
  } = options;
  setLogLevel(logLevel);
  progress('Reading configuration ...');
  log('generalDebug_0003', 'Getting the tgz files ...');
  const files = await getFiles(baseDir, source, fresh);
  const successfulUploads: Array<string> = [];
  log('generalDebug_0003', 'Received available tgz files.');

  if (!url) {
    fail('missingPiletFeedUrl_0060');
  }

  if (files.length === 0) {
    fail('missingPiletTarball_0061', source);
  }

  log('generalInfo_0000', `Using feed service "${url}".`);

  for (const file of files) {
    log('generalDebug_0003', 'Reading the file for upload ...');
    const fileName = relative(baseDir, file);
    const content = await readBinary(baseDir, fileName);

    if (content) {
      progress(`Publishing "%s" ...`, file, url);
      const result = await postFile(url, apiKey, content);

      if (result) {
        successfulUploads.push(file);
        progress(`Published successfully!`);
      } else {
        log('failedToUpload_0062', fileName);
      }
    } else {
      log('failedToRead_0063', fileName);
    }

    log('generalDebug_0003', 'Finished uploading the file.');
  }

  if (files.length === successfulUploads.length) {
    logDone(`Pilet(s) published successfully!`);
  } else {
    fail('failedUploading_0064');
  }
}
