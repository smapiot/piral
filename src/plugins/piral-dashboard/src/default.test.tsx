import * as React from 'react';
import { mount } from 'enzyme';
import { DefaultContainer } from './default';

jest.mock('piral-core', () => ({
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

const state = {
  registry: {
    tiles: {},
    extensions: {},
  },
};

(React as any).useMemo = (cb) => cb();

const StubDashboard: React.FC = () => <div />;
StubDashboard.displayName = 'StubDashboard';

const StubTile: React.FC = () => <div />;
StubTile.displayName = 'StubTile';

describe('Default Dashboard Component', () => {
  it('renders the react fragment in the default case', () => {
    (state.registry.tiles as any).a = {
      component: StubTile,
      preferences: {},
    };
    const node = mount(
      <DefaultContainer history={undefined} location={undefined} match={undefined}>
        <StubTile />
      </DefaultContainer>,
    );
    expect(node.find(StubDashboard).length).toBe(0);
    expect(node.find(StubTile).length).toBe(1);
  });

  it('renders the provided extension in the default case', () => {
    (state.registry.extensions as any).dashboard = [
      {
        component: StubDashboard,
      },
    ];
    const node = mount(
      <DefaultContainer history={undefined} location={undefined} match={undefined}>
        <StubTile />
      </DefaultContainer>,
    );
    expect(node.find(StubTile).length).toBe(0);
    expect(node.find(StubDashboard).length).toBe(1);
  });
});
