import { isfunc, Pilet } from 'piral-base';
import { PiletMetadata } from 'piral-core';
import { getImportMaps, convertToMetadata } from './utils';

/**
 * Resolves a pilet from the given metadata using SystemJS.
 * The pilet must have been derived from the import maps.
 * @param meta The pilet's metadata.
 */
export function loadPilet(meta: PiletMetadata): Promise<Pilet> {
  return System.import(meta.name)
    .catch((err) => {
      console.error('Could not load the pilet.', meta, err);
      return {};
    })
    .then((moduleContent) => ({
      ...meta,
      ...moduleContent,
    }))
    .then((pilet: Pilet) => {
      if (!isfunc(pilet.setup)) {
        pilet.setup = () => {};
      }

      return pilet;
    });
}

/**
 * Resolves the pilets from the specified import maps.
 * Note that here all modules from the import maps are considered pilets.
 */
export function requestPilets(): Promise<Array<PiletMetadata>> {
  return (System as any).prepareImport().then(getImportMaps).then(convertToMetadata);
}
