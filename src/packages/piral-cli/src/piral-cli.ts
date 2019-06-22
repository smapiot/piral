#!/usr/bin/env node

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

const path = getPath();
const { piralCommands } = require(join(path, 'commands'));
const { setupCli } = require(join(path, 'cli'));
setupCli(piralCommands);
