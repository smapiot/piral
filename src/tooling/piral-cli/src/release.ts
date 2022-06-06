import { basename, dirname, relative, resolve } from 'path';
import { copy, fail, findFile, FormDataObj, postForm, readBinary } from './common';
import { availableReleaseProviders } from './helpers';
import { ReleaseProvider } from './types';

async function getVersion(directory: string) {
  const data = await findFile(directory, 'package.json');

  if (!data) {
    fail('packageJsonNotFound_0020');
  }

  const { version } = require(data);
  return version;
}

export interface QualifiedReleaseProvider {
  name: string;
  action: ReleaseProvider;
}

const providers: Record<string, ReleaseProvider> = {
  none() {
    return Promise.resolve();
  },
  async xcopy(_, files, args) {
    const { target } = args;

    if (!target) {
      fail('publishXcopyMissingTarget_0112');
    }

    await Promise.all(files.map(async (file) => copy(file, resolve(target, basename(file)))));
  },
  async feed(directory, files, args, interactive) {
    const { url, apiKey, scheme = 'basic', version = await getVersion(directory) } = args;

    if (!url) {
      fail('publishFeedMissingUrl_0115');
    }

    if (!version) {
      fail('publishFeedMissingVersion_0116');
    }

    const data: FormDataObj = {
      version,
      type: 'custom',
    };

    for (const file of files) {
      const relPath = relative(directory, file);
      const fileName = basename(file);
      const content = await readBinary(dirname(file), fileName);
      data[relPath] = [content, fileName];
    }

    await postForm(url, scheme as any, apiKey, data, {}, undefined, interactive);
  },
};

function findReleaseProvider(providerName: string) {
  const provider = providers[providerName];

  if (typeof provider !== 'function') {
    fail('publishProviderMissing_0113', providerName, availableReleaseProviders);
  }

  return provider;
}

availableReleaseProviders.push(...Object.keys(providers));

export function setReleaseProvider(provider: QualifiedReleaseProvider) {
  providers[provider.name] = provider.action;

  if (!availableReleaseProviders.includes(provider.name)) {
    availableReleaseProviders.push(provider.name);
  }
}

export function publishArtifacts(
  providerName: string,
  directory: string,
  files: Array<string>,
  args: Record<string, string>,
  interactive: boolean,
) {
  const runRelease = findReleaseProvider(providerName);
  return runRelease(directory, files, args, interactive);
}
