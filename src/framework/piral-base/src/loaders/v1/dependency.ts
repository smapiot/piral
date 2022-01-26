import { includeScript } from '../../utils';
import type { PiletV1Entry } from '../../types';

/**
 * Includes the given single pilet script via its URL with a dependency resolution.
 * @param entry The data of the dependency to include.
 * @param crossOrigin The override for the cross-origin attribute.
 * @returns The evaluated module.
 */
export function includeDependency(entry: PiletV1Entry, crossOrigin?: string) {
  return includeScript(entry.requireRef, entry.link, entry.integrity, crossOrigin);
}
