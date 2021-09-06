import { SinglePilet } from './types';

export function cleanup(pilet: SinglePilet) {
  // check if this was actually set up using a require reference
  if ('requireRef' in pilet) {
    const depName = pilet.requireRef;
    delete window[depName];
  }
}
