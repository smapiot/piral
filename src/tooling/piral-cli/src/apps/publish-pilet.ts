import { relative, join, dirname, basename } from 'path';
import { buildPilet } from './build-pilet';
import { LogLevels, PiletSchemaVersion, PiletPublishSource } from '../types';
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
  findTarball,
  downloadFile,
} from '../common';

export interface PublishPiletOptions {
  /**
   * Sets the root module's path to use as source starting point when
   * used with `--fresh`, otherwise expects source to be a path leading
   * to a `*.tgz` file.
   */
  source?: string;

  /**
   * Sets the URL of the feed service to deploy to.
   */
  url?: string;

  /**
   * Sets the API key to use.
   */
  apiKey?: string;

  /**
   * Sets the log level to use (1-5).
   */
  logLevel?: LogLevels;

  /**
   * Specifies if the pilet should be built before publishing.
   * If yes, then the tarball is created from fresh build artifacts.
   */
  fresh?: boolean;

  /**
   * Defines a custom certificate for the feed service.
   */
  cert?: string;

  /**
   * Sets the schema version of the pilet. Usually, the default one should be picked.
   */
  schemaVersion?: PiletSchemaVersion;

  /**
   * Changing the publish source makes it possible to publish pilets that have
   * been stored on non-local paths, e.g., when a pilet was already published to
   * an NPM feed.
   */
  from?: PiletPublishSource;

  /**
   * Places additional fields that should be posted to the feed service.
   */
  fields?: Record<string, string>;
}

export const publishPiletDefaults: PublishPiletOptions = {
  source: '*.tgz',
  url: undefined,
  apiKey: undefined,
  fresh: false,
  cert: undefined,
  logLevel: LogLevels.info,
  schemaVersion: 'v1',
  from: 'local',
  fields: {},
};

async function getFiles(
  baseDir: string,
  source: string,
  from: PiletPublishSource,
  fresh: boolean,
  schemaVersion: PiletSchemaVersion,
  ca?: Buffer,
): Promise<Array<string>> {
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
    log('generalDebug_0003', `Did not find fresh flag. Trying to match from "${from}".`);

    switch (from) {
      case 'local':
        log('generalDebug_0003', `Matching files using "${source}".`);
        return await matchFiles(baseDir, source);
      case 'remote':
        log('generalDebug_0003', `Download file from "${source}".`);
        return await downloadFile(source, ca);
      case 'npm':
        log('generalDebug_0003', `View NPM package "${source}".`);
        const url = await findTarball(source);
        log('generalDebug_0003', `Download file from "${url}".`);
        return await downloadFile(url, ca);
    }
  }
}

export async function publishPilet(baseDir = process.cwd(), options: PublishPiletOptions = {}) {
  const {
    source = publishPiletDefaults.source,
    url = config.url ?? publishPiletDefaults.url,
    apiKey = config.apiKeys?.[url] ?? config.apiKey ?? publishPiletDefaults.apiKey,
    fresh = publishPiletDefaults.fresh,
    logLevel = publishPiletDefaults.logLevel,
    from = publishPiletDefaults.from,
    schemaVersion = publishPiletDefaults.schemaVersion,
    cert = config.cert ?? publishPiletDefaults.cert,
    fields = publishPiletDefaults.fields,
  } = options;
  setLogLevel(logLevel);
  progress('Reading configuration ...');

  if (!url) {
    fail('missingPiletFeedUrl_0060');
  }

  log('generalDebug_0003', 'Checking if certificate exists.');
  let ca: Buffer = undefined;

  if (await checkExists(cert)) {
    const dir = dirname(cert);
    const file = basename(cert);
    log('generalDebug_0003', `Reading certificate file "${file}" from "${dir}".`);
    ca = await readBinary(dir, file);
  }

  log('generalDebug_0003', 'Getting the tgz files ...');
  const files = await getFiles(baseDir, source, from, fresh, schemaVersion, ca);
  const successfulUploads: Array<string> = [];
  log('generalDebug_0003', 'Received available tgz files.');

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
      const result = await postFile(url, apiKey, content, fields, ca);

      if (result.success) {
        successfulUploads.push(file);

        if (result.response) {
          log('httpPostResponse_0067', result);
        }

        progress(`Published successfully!`);
      } else if (result.status === 402) {
        log('failedToUploadPayment_0161', result.response);
      } else if (result.status === 409) {
        log('failedToUploadVersion_0162', result.response);
      } else if (result.status === 413) {
        log('failedToUploadSize_0163', result.response);
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
