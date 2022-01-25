import * as actions from './actions';
import type { CliPlugin } from 'piral-cli';

const plugin: CliPlugin = (cli) => {
  cli.withBundler('xbuild', actions);
};

module.exports = plugin;
