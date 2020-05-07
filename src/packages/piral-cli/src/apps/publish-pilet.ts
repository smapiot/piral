import { relative, join, dirname, basename } from 'path';
import { buildPilet } from './build-pilet';
import { LogLevels, PiletSchemaVersion } from '../types';
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
  config,
  checkExists,
} from '../common';

export interface PublishPiletOptions {
  source?: string;
  url?: string;
  apiKey?: string;
  logLevel?: LogLevels;
  fresh?: boolean;
  cert?: string;
  schemaVersion?: PiletSchemaVersion;
}

export const publishPiletDefaults: PublishPiletOptions = {
  source: '*.tgz',
  url: '',
  apiKey: '',
  fresh: false,
  cert: undefined,
  logLevel: LogLevels.info,
  schemaVersion: 'v1',
};

async function getFiles(baseDir: string, source: string, fresh: boolean, schemaVersion: PiletSchemaVersion) {
  if (fresh) {
    log('generalDebug_0003', 'Detected "--fresh". Trying to resolve the package.json.');
    const details = require(join(baseDir, 'package.json'));
    progress('Triggering pilet build ...');
    await buildPilet(baseDir, {
      target: details.main,
      fresh,
      schemaVersion,
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
    url = config.url ?? publishPiletDefaults.url,
    apiKey = config.apiKey ?? publishPiletDefaults.apiKey,
    fresh = publishPiletDefaults.fresh,
    logLevel = publishPiletDefaults.logLevel,
    schemaVersion = publishPiletDefaults.schemaVersion,
    cert = config.cert ?? publishPiletDefaults.cert,
  } = options;
  setLogLevel(logLevel);
  progress('Reading configuration ...');
  log('generalDebug_0003', 'Getting the tgz files ...');
  const files = await getFiles(baseDir, source, fresh, schemaVersion);
  const successfulUploads: Array<string> = [];
  let ca: Buffer = undefined;
  log('generalDebug_0003', 'Received available tgz files.');

  if (!url) {
    fail('missingPiletFeedUrl_0060');
  }

  if (files.length === 0) {
    fail('missingPiletTarball_0061', source);
  }

  log('generalDebug_0003', 'Checking if certificate exists.');

  if (await checkExists(cert)) {
    const dir = dirname(cert);
    const file = basename(cert);
    log('generalDebug_0003', `Reading certificate file "${file}" from "${dir}".`);
    ca = await readBinary(dir, file);
  }

  log('generalInfo_0000', `Using feed service "${url}".`);

  for (const file of files) {
    log('generalDebug_0003', 'Reading the file for upload ...');
    const fileName = relative(baseDir, file);
    const content = await readBinary(baseDir, fileName);

    if (content) {
      progress(`Publishing "%s" ...`, file, url);
      const result = await postFile(url, apiKey, content, ca);

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
