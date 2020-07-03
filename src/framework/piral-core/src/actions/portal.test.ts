import * as React from 'react';
import { Atom, swap } from '@dbeining/react-atom';
import { showPortal, destroyPortal } from './portal';

describe('Piral-Core portal actions', () => {
  it('showPortal', () => {
    const children = <div></div>;
    const portal: React.ReactPortal = { key: 'test', children: children } as any;
    const state = Atom.of({
      portals: { test: [] },
    });
    const ctx: any = {
      state,
      dispatch(update) {
        swap(state, update);
      },
    };
    showPortal(ctx, 'test', portal);
    expect(ctx.state).not.toBeNull();
    console.log(ctx);
  });

  
});
