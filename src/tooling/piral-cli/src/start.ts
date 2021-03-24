import { SelectCommands } from './types';

export async function start(from: SelectCommands) {
  const { loadPlugins } = require('./plugin');
  const { commands } = require('./commands');
  const { setupCli } = require('./cli');
  await loadPlugins();
  await setupCli(from(commands));
}
