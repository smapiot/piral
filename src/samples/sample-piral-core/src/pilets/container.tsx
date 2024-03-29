import * as React from 'react';
import { Pilet, PiletApi } from 'piral-core';
import { TileComponentProps } from 'piral-dashboard';

const MyTile: React.FC<{ count: number; increment(): void }> = ({ count, increment }) => (
  <div className="tile">
    <div>
      <b>Preserves the count</b>
    </div>
    <button onClick={increment}>{count}</button>
  </div>
);

/**
 * Shows an advanced usage of the global state container.
 */
export const ContainerPilet: Pilet = {
  name: 'Container Module',
  version: '1.0.0',
  spec: 'v2',
  dependencies: {},
  config: {},
  basePath: '/pilets',
  link: '/pilets/connector',
  setup(piral: PiletApi) {
    const connect = piral.createState({
      state: {
        count: 0,
      },
      actions: {
        increment(dispatch) {
          dispatch((state) => ({
            count: state.count + 1,
          }));
        },
      },
    });

    piral.registerTile(
      connect<TileComponentProps>(({ state, actions }) => <MyTile count={state.count} increment={actions.increment} />),
    );
  },
};
