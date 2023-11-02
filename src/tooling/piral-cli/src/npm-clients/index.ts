import { dirname, resolve } from 'path';
import { findFile } from '../common/io';

import * as lerna from './lerna';
import * as npm from './npm';
import * as pnp from './pnp';
import * as pnpm from './pnpm';
import * as rush from './rush';
import * as yarn from './yarn';
import * as bun from './bun';

export const clients = {
  lerna,
  npm,
  pnp,
  pnpm,
  rush,
  yarn,
  bun,
};

type ClientName = keyof typeof clients;

const directClients = ['npm', 'pnp', 'yarn', 'pnpm', 'bun'];

export function isWrapperClient(client: ClientName) {
  return !directClients.includes(client);
}

export async function detectClients(root: string) {
  const packageJson = await findFile(resolve(root, '..'), 'package.json');
  const stopDir = packageJson ? dirname(packageJson) : undefined;

  return await Promise.all(
    Object.keys(clients).map(async (client: ClientName) => {
      const result = await clients[client].detectClient(root, stopDir);
      return {
        client,
        result,
      };
    }),
  );
}
