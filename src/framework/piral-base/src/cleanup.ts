import { getBasePath } from './utils';
import { SinglePilet } from './types';

export function cleanup(pilet: SinglePilet) {
  const css = document.querySelector(`link[data-origin=${JSON.stringify(pilet.name)}]`);
  css?.remove();

  // check if this was actually set up using a require reference
  if ('requireRef' in pilet) {
    const depName = pilet.requireRef;
    delete window[depName];
  }

  // remove the pilet's evaluated modules from SystemJS (except the shared dependencies)
  if ('link' in pilet) {
    const basePath = getBasePath(pilet.link);
    const dependencies = Object.keys(pilet.dependencies || {}).map((m) => pilet.dependencies[m]);

    [...System.entries()]
      .filter(([id]) => id.startsWith(basePath) && !dependencies.includes(id))
      .forEach(([id]) => System.delete(id));
  }
}
