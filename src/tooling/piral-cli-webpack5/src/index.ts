import * as actions from './actions';
import { CliPlugin } from 'piral-cli';

const plugin: CliPlugin = (cli) => {
  cli.withBundler('webpack5', actions);
};

module.exports = plugin;
