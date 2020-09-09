import * as actions from './actions';
import { CliPlugin } from 'piral-cli';
import { standardPatches } from './parcel';

const plugin: CliPlugin = (cli) => {
  cli.withBundler('parcel', actions);

  Object.keys(standardPatches).forEach((key) => {
    cli.withPatcher(key, standardPatches[key]);
  });
};

module.exports = plugin;
