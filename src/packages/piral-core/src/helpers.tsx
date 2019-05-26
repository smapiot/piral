import { isfunc } from 'react-arbiter';
import { PiralCoreApi, PiralApi, ScaffoldPlugin } from './types';

export function defaultModuleRequester() {
  return Promise.resolve([]);
}

export function defaultApiExtender<TApi>(value: PiralCoreApi<TApi>): PiralApi<TApi> {
  return value as any;
}

export function getExtender(plugins: Array<ScaffoldPlugin>): ScaffoldPlugin {
  const extenders = plugins.filter(isfunc);
  return container => {
    extenders.forEach(extender => {
      container = extender(container);
    });
    return container;
  };
}
