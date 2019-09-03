import * as React from 'react';
import { Pilet } from 'piral-core';

/**
 * Shows an advanced usage of the connector.
 */
export const ConnectorPilet: Pilet = {
  content: '',
  name: 'Connector Module',
  version: '1.0.0',
  hash: '4',
  setup(piral) {
    const connect = piral.createConnector<Array<string>>(
      () => new Promise((resolve, reject) => setTimeout(() => resolve(['one', 'two', 'three']), 5000)),
    );

    const DataView = connect(props => (
      <ul>
        {props.data.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    ));

    piral.registerTile(() => (
      <div className="tile">
        <b>This is the example tile from connector module.</b>
        <DataView />
      </div>
    ));
  },
};
