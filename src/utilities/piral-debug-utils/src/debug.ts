import { isfunc, AvailableDependencies, PiletApiCreator, PiletLoader, PiletRequester } from 'piral-base';

export interface DebuggerOptions {
  createApi: PiletApiCreator;
  loadPilet: PiletLoader;
  requestPilets: PiletRequester;
  context?: any;
  getDependencies(): AvailableDependencies;
  onChange?(cb: (previous: any, current: any) => void): void;
}

export function installPiralDebug(options: DebuggerOptions) {
  const { context, onChange, ...pilets } = options;

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

  if (isfunc(onChange)) {
    onChange((previous, current) => {
      const viewState = sessionStorage.getItem('dbg:view-state') !== 'off';

      if (viewState) {
        const infos = new Error().stack;

        if (infos) {
          // Chrome, Firefox, ... (full capability)
          const lastLine = infos.split('\n')[7];

          if (lastLine) {
            const action = lastLine.replace(/^\s+at\s+(Atom\.|Object\.)?/, '');
            console.group(
              `%c Piral State Change %c ${new Date().toLocaleTimeString()}`,
              'color: gray; font-weight: lighter;',
              'color: black; font-weight: bold;',
            );
            console.log('%c Previous', `color: #9E9E9E; font-weight: bold`, previous);
            console.log('%c Action', `color: #03A9F4; font-weight: bold`, action);
            console.log('%c Next', `color: #4CAF50; font-weight: bold`, current);
            console.groupEnd();
          }
        } else {
          // IE 11, ... (does not know colors etc.)
          console.log('Changed state', previous, current);
        }
      }
    });
  }
}
