import { dirname, resolve } from 'path';
import { findFile } from '../common/io';
import type { NpmClientType, NpmDirectClientType, NpmWapperClientType } from '../types';

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

const directClients: Array<NpmDirectClientType> = ['npm', 'pnp', 'yarn', 'pnpm', 'bun'];
const wrapperClients: Array<NpmWapperClientType> = ['lerna', 'rush'];

export function isWrapperClient(client: NpmClientType): client is NpmWapperClientType {
  return wrapperClients.includes(client as any);
}

export function isDirectClient(client: NpmClientType): client is NpmDirectClientType {
  return directClients.includes(client as any);
}

async function detectClients<T extends NpmClientType>(
  root: string,
  clientNames: Array<T>,
): Promise<Array<{ client: T; result: boolean }>> {
  const packageJson = await findFile(resolve(root, '..'), 'package.json');
  const stopDir = packageJson ? dirname(packageJson) : undefined;

  return await Promise.all(
    clientNames.map(async (client) => {
      const result = await clients[client].detectClient(root, stopDir);
      return {
        client,
        result,
      };
    }),
  );
}

export function detectDirectClients(root: string) {
  return detectClients<NpmDirectClientType>(root, directClients);
}

export function detectWrapperClients(root: string) {
  return detectClients<NpmWapperClientType>(root, wrapperClients);
}
