import chalk from 'chalk';
import { resolve } from 'path';
import { liveIcon, settingsIcon } from './emoji';
import { logInfo, log, logReset } from './log';
import { Bundler } from '../types';

export function notifyServerOnline(bundlers: Array<Bundler>, path: string, api: string | false) {
  return (svc: any) => {
    log('generalDebug_0003', `The kras server for debugging is online!`);
    const address = `${svc.protocol}://localhost:${chalk.green(svc.port)}`;
    logInfo(`${liveIcon} Running at ${chalk.bold(address + path)}`);
    logInfo(`${settingsIcon} Manage via ${chalk.bold(address + api)}`);
    logReset();
    bundlers.forEach((bundler) => bundler.start());
  };
}

export function createInitialKrasConfig(
  directory: string,
  map: Record<string, string> = {},
  sources: Array<string> = [],
  feed: string | Array<string> = [],
) {
  return {
    api: '/manage-mock-server',
    directory,
    map: {
      '/': '',
      ...map,
    },
    ssl: undefined,
    sources,
    injectorDirs: [resolve(__dirname, '../injectors')],
    injectors: {
      script: {
        active: true,
      },
      har: {
        active: true,
        delay: false,
      },
      json: {
        active: true,
        randomize: true,
      },
      piral: {
        active: true,
        headers: {},
      },
      pilet: {
        active: true,
        meta: 'debug-meta.json',
        headers: {},
        feed,
      },
      proxy: {
        active: true,
      },
    },
  };
}
