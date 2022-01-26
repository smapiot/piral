import type { PiralBuildHandler } from 'piral-cli';
import { runScript } from 'piral-cli/utils';
import { getConfig } from '../helpers';

interface ToolConfig {
  command: string;
}

function validateConfig(config: any): ToolConfig {
  if (typeof config.command !== 'string') {
    throw new Error('The "command" property needs to be a string.');
  }

  return {
    command: config.command,
  };
}

const handler: PiralBuildHandler = {
  async create(options) {
    const { root } = options;
    const config = await getConfig(root, 'piral:debug', validateConfig);

    return Promise.resolve({
      bundle() {
        return Promise.resolve({
          outDir: '',
          outFile: '',
        });
      },
      onEnd() {},
      onStart() {},
    });
  },
};

export const create = handler.create;
