import * as React from 'react';
import { ArbiterModule } from 'react-arbiter';
import { PiralApi, TileComponentProps } from 'piral-core';

/**
 * Shows an advanced usage of the connector.
 */
export const ConnectorModule: ArbiterModule<PiralApi> = {
  content: '',
  dependencies: {},
  name: 'Connector Module',
  version: '1.0.0',
  hash: '4',
  setup(portal) {
    const connect = portal.createConnector<Array<string>>(
      () => new Promise((resolve, reject) => setTimeout(() => resolve(['one', 'two', 'three']), 5000)),
    );

    const DataView = connect(props => (
      <ul>
        {props.data.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    ));

    portal.registerTile(
      'example',
      class extends React.Component<TileComponentProps<PiralApi>> {
        render() {
          return (
            <div className="tile">
              <b>This is the example tile from connector module.</b>
              <DataView />
            </div>
          );
        }
      },
    );
  },
};
