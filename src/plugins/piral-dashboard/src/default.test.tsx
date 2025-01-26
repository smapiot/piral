/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { describe, it, expect, vitest, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { DefaultContainer } from './default';

vitest.mock('piral-core', () => ({
  useGlobalState(select: any) {
    return select(state);
  },
  ExtensionSlot({ empty, params }: any) {
    const exts: any = state.registry.extensions;

    if (exts.dashboard) {
      return (
        <div>
          {exts.dashboard.map(({ component: Component }, i) => (
            <Component {...params} key={i} />
          ))}
        </div>
      );
    }

    return empty();
  },
  defaultRender(child: any, key?: string) {
    return <React.Fragment key={key}>{child}</React.Fragment>;
  },
}));

vitest.mock('react', async () => ({
  ...((await vitest.importActual('react')) as any),
  useMemo: (cb) => cb(),
}));

const state = {
  registry: {
    tiles: {},
    extensions: {},
  },
};

const StubDashboard: React.FC = () => <div role="dashboard" />;
StubDashboard.displayName = 'StubDashboard';

const StubTile: React.FC = () => <div role="tile" />;
StubTile.displayName = 'StubTile';

describe('Default Dashboard Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the react fragment in the default case', () => {
    (state.registry.tiles as any).a = {
      component: StubTile,
      preferences: {},
    };
    const node = render(
      <DefaultContainer>
        <StubTile />
      </DefaultContainer>,
    );
    expect(node.queryByRole('dashboard')).toBe(null);
    expect(node.getAllByRole('tile').length).toBe(1);
  });

  it('renders the provided extension in the default case', () => {
    (state.registry.extensions as any).dashboard = [
      {
        component: StubDashboard,
      },
    ];
    const node = render(
      <DefaultContainer>
        <StubTile />
      </DefaultContainer>,
    );
    expect(node.queryByRole('tile')).toBe(null);
    expect(node.getAllByRole('dashboard').length).toBe(1);
  });
});
