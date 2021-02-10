import { dirname, join, resolve } from 'path';
import { existsSync } from 'fs';
import { fork } from 'child_process';
import { SelectCommands } from './types';

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

export async function select(from: SelectCommands) {
  const localPath = getPath();
  const localRunner = resolve(localPath, 'runner.js');

  if (localPath !== __dirname && existsSync(localRunner)) {
    // If the runner exists and we found a more local installation use the new mode
    const ps = fork(localRunner, [], {
      cwd: process.cwd(),
    });

    ps.send({
      type: 'start',
      select: from.toString(),
      args: process.argv.slice(2),
    });

    ps.on('exit', (code) => process.exit(code));
  } else {
    // If no runner exists or we are in the same directory go for the classic mode
    const { start } = require(join(localPath, 'start'));
    await start(from);
  }
}
