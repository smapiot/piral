import { dirname, join } from 'path';
import { ListCommands, ToolCommand } from './types';

function getPath() {
  try {
    return dirname(
      require.resolve('piral-cli/lib', {
        paths: [process.cwd()],
      }),
    );
  } catch {
    return dirname(__filename);
  }
}

export async function select(from: (commands: ListCommands) => Array<ToolCommand<any>>) {
  const path = getPath();
  const { loadPlugins } = require(join(path, 'plugin'));
  const { commands } = require(join(path, 'commands'));
  const { setupCli } = require(join(path, 'cli'));
  await loadPlugins();
  await setupCli(from(commands));
}
