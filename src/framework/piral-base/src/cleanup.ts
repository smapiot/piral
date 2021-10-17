import { SinglePilet } from './types';

export function cleanup(pilet: SinglePilet) {
  const css = document.querySelector(`link[data-origin=${JSON.stringify(pilet.name)}]`);
  css?.remove();

  // check if this was actually set up using a require reference
  if ('requireRef' in pilet) {
    const depName = pilet.requireRef;
    delete window[depName];
  }
}
