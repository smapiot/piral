import { setupSinglePilet, setupPiletBundle } from './lifecycle';
import type {
  PiletMetadata,
  PiletMetadataV0,
  PiletMetadataV1,
  PiletMetadataV2,
  PiletMetadataBundle,
  PiletRunner,
} from './types';

export type InspectPiletV0 = ['v0', PiletMetadataV0, PiletRunner];

export type InspectPiletV1 = ['v1', PiletMetadataV1, PiletRunner];

export type InspectPiletV2 = ['v2', PiletMetadataV2, PiletRunner];

export type InspectPiletBundle = ['bundle', PiletMetadataBundle, PiletRunner];

export type InspectPiletUnknown = ['unknown', PiletMetadata, PiletRunner];

export type InspectPiletResult =
  | InspectPiletV0
  | InspectPiletV1
  | InspectPiletV2
  | InspectPiletUnknown
  | InspectPiletBundle;

export function inspectPilet(meta: PiletMetadata): InspectPiletResult {
  const inBrowser = typeof document !== 'undefined';

  if (inBrowser && 'link' in meta && meta.spec === 'v2') {
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
