import * as React from 'react';
import * as hooks from '../hooks';
import { render } from '@testing-library/react';
import { ResponsiveLayout } from './ResponsiveLayout';
import { defaultBreakpoints } from '../utils';

jest.mock('../hooks');

describe('Responsive Module', () => {
  it('always renders the given children', () => {
    (hooks as any).useMedia = () => 'desktop';
    const Layout: React.FC = jest.fn().mockImplementation(({ children }) => <div>{children}</div>);
    Layout.displayName = 'Layout';
    const StubComponent: React.FC = () => <div role="stub" />;
    StubComponent.displayName = 'StubComponent';
    const node = render(
      <ResponsiveLayout Layout={Layout} breakpoints={defaultBreakpoints}>
        <StubComponent />
      </ResponsiveLayout>,
    );
    expect(node.queryAllByRole('stub').length).toBe(1);
  });

  it('does not call changeTo when nothing changed', () => {
    (hooks as any).useMedia = () => 'desktop';
    const Layout = jest.fn().mockImplementation(({ children }) => <div>{children}</div>);
    render(<ResponsiveLayout Layout={Layout} breakpoints={defaultBreakpoints} />);
    expect(Layout).toHaveBeenCalledWith({ currentLayout: 'desktop' }, {});
  });

  it('does calls changeTo when someething changed (desktop -> tablet)', () => {
    (hooks as any).useMedia = () => 'tablet';
    const Layout = jest.fn().mockImplementation(({ children }) => <div>{children}</div>);
    render(<ResponsiveLayout Layout={Layout} breakpoints={defaultBreakpoints} />);
    expect(Layout).toHaveBeenCalledWith({ currentLayout: 'tablet' }, {});
  });

  it('does calls changeTo when someething changed (desktop -> mobile)', () => {
    (hooks as any).useMedia = () => 'mobile';
    const Layout = jest.fn().mockImplementation(({ children }) => <div>{children}</div>);
    render(<ResponsiveLayout Layout={Layout} breakpoints={defaultBreakpoints} />);
    expect(Layout).toHaveBeenCalledWith({ currentLayout: 'mobile' }, {});
  });
});
