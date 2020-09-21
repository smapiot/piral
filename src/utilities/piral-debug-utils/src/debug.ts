import { PiletApiCreator, PiletDependencyGetter, PiletLoader, PiletRequester } from 'piral-base';

export interface DebuggerOptions {
  createApi: PiletApiCreator;
  getDependencies: PiletDependencyGetter;
  loadPilet: PiletLoader;
  requestPilets: PiletRequester;
  context?: any;
}

export function installPiralDebug(options: DebuggerOptions) {
  const { context, ...pilets } = options;

  // the DEBUG_PIRAL env should contain the Piral CLI compatibility version
  window['dbg:piral'] = {
    debug: 'v0',
    instance: {
      name: process.env.BUILD_PCKG_NAME,
      version: process.env.BUILD_PCKG_VERSION,
      dependencies: process.env.SHARED_DEPENDENCIES,
      context,
    },
    build: {
      date: process.env.BUILD_TIME_FULL,
      cli: process.env.PIRAL_CLI_VERSION,
      compat: process.env.DEBUG_PIRAL,
    },
    pilets,
  };
}
