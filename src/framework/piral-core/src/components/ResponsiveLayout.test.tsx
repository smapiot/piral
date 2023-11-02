/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import * as hooks from '../hooks';
import { render } from '@testing-library/react';
import { describe, it, expect, vitest } from 'vitest';
import { ResponsiveLayout } from './ResponsiveLayout';
import { defaultBreakpoints } from '../utils';

vitest.mock('../hooks');

describe('Responsive Module', () => {
  it('always renders the given children', () => {
    (hooks as any).useMedia = () => 'desktop';
    const Layout: React.FC = vitest.fn().mockImplementation(({ children }) => <div>{children}</div>);
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
    const Layout = vitest.fn().mockImplementation(({ children }) => <div>{children}</div>);
    render(<ResponsiveLayout Layout={Layout} breakpoints={defaultBreakpoints} />);
    expect(Layout).toHaveBeenCalledWith({ currentLayout: 'desktop' }, {});
  });

  it('does calls changeTo when someething changed (desktop -> tablet)', () => {
    (hooks as any).useMedia = () => 'tablet';
    const Layout = vitest.fn().mockImplementation(({ children }) => <div>{children}</div>);
    render(<ResponsiveLayout Layout={Layout} breakpoints={defaultBreakpoints} />);
    expect(Layout).toHaveBeenCalledWith({ currentLayout: 'tablet' }, {});
  });

  it('does calls changeTo when someething changed (desktop -> mobile)', () => {
    (hooks as any).useMedia = () => 'mobile';
    const Layout = vitest.fn().mockImplementation(({ children }) => <div>{children}</div>);
    render(<ResponsiveLayout Layout={Layout} breakpoints={defaultBreakpoints} />);
    expect(Layout).toHaveBeenCalledWith({ currentLayout: 'mobile' }, {});
  });
});
