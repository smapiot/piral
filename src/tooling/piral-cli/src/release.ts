import { basename, resolve } from 'path';
import { copy, fail } from './common';
import { availableReleaseProviders } from './helpers';
import { ReleaseProvider } from './types';

export interface QualifiedReleaseProvider {
  name: string;
  action: ReleaseProvider;
}

const providers: Record<string, ReleaseProvider> = {
  none() {
    return Promise.resolve();
  },
  async xcopy(files, args) {
    const { target } = args;

    if (!target) {
      fail('publishXcopyMissingTarget_0112');
    }

    await Promise.all(files.map(async (file) => copy(file, resolve(target, basename(file)))));
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

export function publishArtifacts(providerName: string, files: Array<string>, args: Record<string, string>) {
  const runRelease = findReleaseProvider(providerName);
  return runRelease(files, args);
}
