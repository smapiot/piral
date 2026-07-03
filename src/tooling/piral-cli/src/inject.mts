import * as api from './api.mjs';
import { log } from './common/index.mjs';
import type { CliPlugin } from './types';

export function inject(pluginPath: string) {
  try {
    const plugin: CliPlugin = require(pluginPath);

    if (typeof plugin === 'function') {
      plugin(api);
    } else {
      log('generalDebug_0003', `Skipping plugin from "${pluginPath}". Did not export a function.`);
    }
  } catch (ex) {
    log('pluginCouldNotBeLoaded_0205', pluginPath, ex);
  }
}
