import { setupSinglePilet, setupPiletBundle } from './lifecycle';
import type {
  PiletEntry,
  PiletV0Entry,
  PiletV1Entry,
  PiletV2Entry,
  PiletV3Entry,
  PiletMfEntry,
  PiletBundleEntry,
  PiletRunner,
} from './types';

export type InspectPiletV0 = ['v0', PiletV0Entry, PiletRunner];

export type InspectPiletV1 = ['v1', PiletV1Entry, PiletRunner];

export type InspectPiletV2 = ['v2', PiletV2Entry, PiletRunner];

export type InspectPiletV3 = ['v3', PiletV3Entry, PiletRunner];

export type InspectPiletMf = ['mf', PiletMfEntry, PiletRunner];

export type InspectPiletBundle = ['bundle', PiletBundleEntry, PiletRunner];

export type InspectPiletUnknown = ['unknown', PiletEntry, PiletRunner];

export type InspectPiletResult =
  | InspectPiletV0
  | InspectPiletV1
  | InspectPiletV2
  | InspectPiletV3
  | InspectPiletMf
  | InspectPiletUnknown
  | InspectPiletBundle;

export function inspectPilet(meta: PiletEntry): InspectPiletResult {
  const inBrowser = typeof document !== 'undefined';

  if ('link' in meta && meta.spec === 'v3') {
    return ['v3', meta, setupSinglePilet];
  } else if (inBrowser && 'link' in meta && meta.spec === 'mf') {
    return ['mf', meta, setupSinglePilet];
  } else if (inBrowser && 'link' in meta && meta.spec === 'v2') {
    return ['v2', meta, setupSinglePilet];
  } else if (inBrowser && 'requireRef' in meta && meta.spec !== 'v2') {
    return ['v1', meta, setupSinglePilet];
  } else if (inBrowser && 'bundle' in meta && meta.bundle) {
    return ['bundle', meta, setupPiletBundle];
  } else if ('hash' in meta) {
    return ['v0', meta, setupSinglePilet];
  } else {
    return ['unknown', meta, setupSinglePilet];
  }
}
