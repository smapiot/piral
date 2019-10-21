import { ArbiterModuleMetadata } from 'react-arbiter';
import { Client } from 'urql';
import { gqlQuery } from './queries';

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

export function requestPiletsFromGraphQL(client: Client) {
  return gqlQuery<PiletQueryResult>(client, piletsQuery).then(({ pilets }) => pilets);
}
