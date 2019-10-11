import * as React from 'react';
import { Pilet } from 'piral-core';
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
  content: '',
  name: 'Container Module',
  version: '1.0.0',
  hash: '14',
  setup(piral) {
    const connect = piral.createState({
      state: {
        count: 0,
      },
      actions: {
        increment(dispatch) {
          dispatch(state => ({
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
