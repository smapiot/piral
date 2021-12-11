import chalk from 'chalk';
import { KrasConfigurationInjectors } from 'kras';
import { liveIcon, settingsIcon } from './emoji';
import { logInfo, log, logReset } from './log';
import { Bundler } from '../types';

export function reorderInjectors(injectorName: string, injectorConfig: any, injectors: KrasConfigurationInjectors) {
  return {
    script: injectors.script || {
      active: true,
    },
    har: injectors.har || {
      active: true,
    },
    json: injectors.json || {
      active: true,
    },
    [injectorName]: injectorConfig,
    ...injectors,
  };
}

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
