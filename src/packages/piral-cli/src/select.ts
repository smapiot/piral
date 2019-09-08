import { dirname, join } from 'path';

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

export async function select(fromCommands: (commands: any) => any) {
  const path = getPath();
  const { loadPlugins } = require(join(path, 'plugin'));
  const commands = fromCommands(require(join(path, 'commands')));
  const { setupCli } = require(join(path, 'cli'));
  await loadPlugins();
  setupCli(commands);
}
