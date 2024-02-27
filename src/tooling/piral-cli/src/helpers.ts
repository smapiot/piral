import { ForceOverwrite } from './common/enums';
import { bundlerNames, frameworkLibs } from './common/constants';
import type {
  Framework,
  NpmClientType,
  PiletSchemaVersion,
  PiletPublishSource,
  PiralBuildType,
  PiletBuildType,
  PublishScheme,
  SourceLanguage,
  PiralPublishType,
} from './types';

export const schemaKeys: Array<PiletSchemaVersion> = ['v0', 'v1', 'v2', 'v3', 'mf', 'none'];
export const publishModeKeys: Array<PublishScheme> = ['none', 'basic', 'bearer', 'digest'];
export const fromKeys: Array<PiletPublishSource> = ['local', 'remote', 'npm'];
export const piralBuildTypeKeys: Array<PiralBuildType> = [
  'all',
  'release',
  'emulator',
  'emulator-package',
  'emulator-sources',
  'emulator-website',
];
export const piralPublishTypeKeys: Array<PiralPublishType> = ['release', 'emulator'];
export const piletBuildTypeKeys: Array<PiletBuildType> = ['default', 'standalone', 'manifest'];
export const clientTypeKeys: Array<NpmClientType> = ['npm', 'pnpm', 'pnp', 'yarn', 'lerna', 'rush', 'bun'];
export const sourceLanguageKeys: Array<SourceLanguage> = ['ts', 'js'];
export const bundlerKeys: Array<string> = ['none', ...bundlerNames];
export const availableBundlers: Array<string> = [];
export const availableReleaseProviders: Array<string> = [];
export const frameworkKeys: Array<Framework> = [...frameworkLibs];
export const forceOverwriteKeys = Object.keys(ForceOverwrite).filter((m) => typeof ForceOverwrite[m] === 'number');

export function valueOfForceOverwrite(key: string): ForceOverwrite {
  for (const forceOverwriteKey of forceOverwriteKeys) {
    if (forceOverwriteKey === key) {
      return ForceOverwrite[forceOverwriteKey];
    }
  }

  return ForceOverwrite.no;
}

export function keyOfForceOverwrite(value: ForceOverwrite) {
  for (const forceOverwriteKey of forceOverwriteKeys) {
    if (ForceOverwrite[forceOverwriteKey] === value) {
      return forceOverwriteKey;
    }
  }

  return forceOverwriteKeys[0];
}
