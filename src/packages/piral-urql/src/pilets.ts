import { ArbiterModuleMetadata } from 'react-arbiter';
import { gqlQuery } from './queries';
import { UrqlClient } from './types';

export interface PiletQueryResult {
  pilets: Array<ArbiterModuleMetadata>;
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
