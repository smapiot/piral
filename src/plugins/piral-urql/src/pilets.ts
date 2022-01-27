import type { PiletMetadata } from 'piral-core';
import { gqlQuery } from './queries';
import { UrqlClient } from './types';

export interface PiletQueryResult {
  pilets: Array<PiletMetadata>;
}

const piletsQuery = `query initialData {
  pilets {
    hash
    link
    name
    version
  }
}`;

export function requestPiletsFromGraphQL(client: UrqlClient) {
  return gqlQuery<PiletQueryResult>(client, piletsQuery).then(({ pilets }) => pilets);
}
