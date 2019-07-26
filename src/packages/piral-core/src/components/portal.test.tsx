import * as React from 'react';
import * as hooks from '../hooks';
import * as routes from './routes';
import * as responsive from './responsive';
import { mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import { Portal } from './portal';

const StubDashboard: React.FC = props => <div />;
StubDashboard.displayName = 'StubDashboard';

const StubErrorInfo: React.FC = props => <div />;
StubErrorInfo.displayName = 'StubErrorInfo';

const StubLoader: React.FC = props => <div />;
StubLoader.displayName = 'StubLoader';

jest.mock('../hooks');
jest.mock('./routes');
jest.mock('./responsive');

(hooks as any).useGlobalState = (select: any) =>
  select({
    app: {
      components: {
        Dashboard: StubDashboard,
        ErrorInfo: StubErrorInfo,
        Loader: StubLoader,
        history: createMemoryHistory(),
      },
    },
  });

(routes as any).Routes = ({ Home }) => <Home />;

(responsive as any).Responsive = ({ children }) => children;

describe('Portal Module', () => {
  it('renders the dashboard / content in layout if loaded without error', () => {
    const display = jest.fn(content => content);
    const node = mount(<Portal loaded>{display}</Portal>);
    expect(node.find(StubLoader).length).toBe(0);
    expect(node.find(StubErrorInfo).length).toBe(0);
    expect(node.find(StubDashboard).length).toBe(1);
    expect(display).toHaveBeenCalled();
  });

  it('just renders the loader if not loaded yet', () => {
    const display = jest.fn(content => content);
    const node = mount(<Portal>{display}</Portal>);
    expect(node.find(StubLoader).length).toBe(1);
    expect(node.find(StubErrorInfo).length).toBe(0);
    expect(node.find(StubDashboard).length).toBe(0);
    expect(display).not.toHaveBeenCalled();
  });

  it('renders the error in layout if errored when loading', () => {
    const display = jest.fn(content => content);
    const node = mount(
      <Portal loaded error="my error">
        {display}
      </Portal>,
    );
    expect(node.find(StubLoader).length).toBe(0);
    expect(node.find(StubErrorInfo).length).toBe(1);
    expect(node.find(StubErrorInfo).prop('type')).toBe('loading');
    expect(node.find(StubDashboard).length).toBe(0);
    expect(display).toHaveBeenCalled();
  });

  it('renders the not found error in layout', () => {
    (routes as any).Routes = ({ NotFound }) => <NotFound />;
    const display = jest.fn(content => content);
    const node = mount(<Portal loaded>{display}</Portal>);
    expect(node.find(StubLoader).length).toBe(0);
    expect(node.find(StubErrorInfo).length).toBe(1);
    expect(node.find(StubErrorInfo).prop('type')).toBe('not_found');
    expect(node.find(StubDashboard).length).toBe(0);
    expect(display).toHaveBeenCalled();
  });
});
