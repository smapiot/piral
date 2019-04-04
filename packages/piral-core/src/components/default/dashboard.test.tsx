import * as React from 'react';
import * as globalState from '../../hooks';
import { mount } from 'enzyme';
import { DefaultDashboard } from './dashboard';

const StubDashboard: React.SFC = props => <div />;
StubDashboard.displayName = 'StubDashboard';

const StubTile: React.SFC = props => <div />;
StubTile.displayName = 'StubTile';

describe('Default Dashboard Component', () => {
  it('renders the react fragment in the default case', () => {
    (globalState as any).useGlobalState = (select: any) =>
      select({
        components: {
          tiles: {
            a: {
              component: StubTile,
              preferences: {},
            },
          },
          extensions: {},
        },
      });
    const node = mount(<DefaultDashboard history={undefined} location={undefined} match={undefined} />);
    expect(node.find(StubDashboard).length).toBe(0);
    expect(node.find(StubTile).length).toBe(1);
  });

  it('renders the react fragment in the default case', () => {
    (globalState as any).useGlobalState = (select: any) =>
      select({
        components: {
          tiles: {},
          extensions: {
            dashboard: [
              {
                component: StubDashboard,
              },
            ],
          },
        },
      });
    const node = mount(<DefaultDashboard history={undefined} location={undefined} match={undefined} />);
    expect(node.find(StubTile).length).toBe(0);
    expect(node.find(StubDashboard).length).toBe(1);
  });
});
