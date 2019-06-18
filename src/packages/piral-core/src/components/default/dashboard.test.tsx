import * as React from 'react';
import { mount } from 'enzyme';
import { DefaultDashboard } from './dashboard';

jest.mock('../../hooks/globalState', () => ({
  useGlobalState(select: any) {
    return select(state);
  },
}));

const state = {
  components: {
    tiles: {},
    extensions: {},
  },
};

(React as any).useMemo = cb => cb();

const StubDashboard: React.SFC = props => <div />;
StubDashboard.displayName = 'StubDashboard';

const StubTile: React.SFC = props => <div />;
StubTile.displayName = 'StubTile';

describe('Default Dashboard Component', () => {
  it('renders the react fragment in the default case', () => {
    (state.components.tiles as any).a = {
      component: StubTile,
      preferences: {},
    };
    const node = mount(<DefaultDashboard history={undefined} location={undefined} match={undefined} />);
    expect(node.find(StubDashboard).length).toBe(0);
    expect(node.find(StubTile).length).toBe(1);
  });

  it('renders the react fragment in the default case', () => {
    (state.components.extensions as any).dashboard = [
      {
        component: StubDashboard,
      },
    ];
    const node = mount(<DefaultDashboard history={undefined} location={undefined} match={undefined} />);
    expect(node.find(StubTile).length).toBe(0);
    expect(node.find(StubDashboard).length).toBe(1);
  });
});
