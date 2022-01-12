import * as actions from './actions';
import { CliPlugin } from 'piral-cli';

const plugin: CliPlugin = (cli) => {
  cli.withBundler('parcel2', actions);
};

module.exports = plugin;
