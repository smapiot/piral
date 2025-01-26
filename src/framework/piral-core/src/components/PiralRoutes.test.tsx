/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import * as hooks from '../hooks';
import { describe, it, expect, vitest, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import { render, cleanup } from '@testing-library/react';
import { PiralRoutes } from './PiralRoutes';
import { DefaultRouteSwitch } from '../defaults/DefaultRouteSwitch_v5';

const mountWithRouter = (node, url = '/') =>
  render(
    <MemoryRouter initialEntries={[url]} initialIndex={0}>
      {node}
    </MemoryRouter>,
  );

vitest.mock('../hooks');

vitest.mock('../../app.codegen', () => ({
  useRouteFilter(routes) {
    return routes;
  },
}));

(hooks as any).useGlobalState = (cb) =>
  cb({
    routes: {
      '/': StubHome,
      '/custom': StubCustomPage,
      '/foo': StubFooPage,
      '/foo/bar': StubFooBarPage,
      '/bar': StubBarPage,
    },
    registry: {
      pages: {},
    },
  });

const StubHome: React.FC = (props) => <div role="home" />;
StubHome.displayName = 'StubHome';

const StubCustomPage: React.FC = (props) => <div role="custom-page" />;
StubCustomPage.displayName = 'StubCustomPage';

const StubNotFound: React.FC = (props) => <div role="not-found" />;
StubNotFound.displayName = 'StubNotFound';

const StubComponent: React.FC<{ data: any }> = (props) => <div role="component" />;
StubComponent.displayName = 'StubComponent';

const StubFooPage: React.FC<{ data: any }> = (props) => <div role="foo-page" />;
StubFooPage.displayName = 'StubFooPage';

const StubFooBarPage: React.FC<{ data: any }> = (props) => <div role="foo-bar-page" />;
StubFooBarPage.displayName = 'StubFooBarPage';

const StubBarPage: React.FC<{ data: any }> = (props) => <div role="bar-page" />;
StubBarPage.displayName = 'StubBarPage';

describe('Routes Module', () => {
  afterEach(() => {
    cleanup();
  });

  it('always goes to the given home on "/"', () => {
    const node = mountWithRouter(<PiralRoutes NotFound={StubNotFound} RouteSwitch={DefaultRouteSwitch} />, '/');
    expect(node.queryAllByRole('home').length).toBe(1);
    expect(node.queryAllByRole('not-found').length).toBe(0);
    expect(node.queryAllByRole('custom-page').length).toBe(0);
    expect(node.queryAllByRole('foo-bar-page').length).toBe(0);
  });

  it('goes to the not found on an invalid path', () => {
    const node = mountWithRouter(<PiralRoutes NotFound={StubNotFound} RouteSwitch={DefaultRouteSwitch} />, '/qxz');
    expect(node.queryAllByRole('home').length).toBe(0);
    expect(node.queryAllByRole('not-found').length).toBe(1);
    expect(node.queryAllByRole('custom-page').length).toBe(0);
    expect(node.queryAllByRole('foo-bar-page').length).toBe(0);
  });

  it('goes to the custom page on "/custom"', () => {
    const node = mountWithRouter(<PiralRoutes NotFound={StubNotFound} RouteSwitch={DefaultRouteSwitch} />, '/custom');
    expect(node.queryAllByRole('home').length).toBe(0);
    expect(node.queryAllByRole('not-found').length).toBe(0);
    expect(node.queryAllByRole('custom-page').length).toBe(1);
    expect(node.queryAllByRole('foo-bar-page').length).toBe(0);
  });

  it('goes exactly to the page on "/foo/bar"', () => {
    const node = mountWithRouter(<PiralRoutes NotFound={StubNotFound} RouteSwitch={DefaultRouteSwitch} />, '/foo/bar');
    expect(node.queryAllByRole('home').length).toBe(0);
    expect(node.queryAllByRole('not-found').length).toBe(0);
    expect(node.queryAllByRole('custom-page').length).toBe(0);
    expect(node.queryAllByRole('foo-bar-page').length).toBe(1);
  });

  it('goes exactly to the page on "/foo"', () => {
    const node = mountWithRouter(<PiralRoutes NotFound={StubNotFound} RouteSwitch={DefaultRouteSwitch} />, '/foo');
    expect(node.queryAllByRole('home').length).toBe(0);
    expect(node.queryAllByRole('not-found').length).toBe(0);
    expect(node.queryAllByRole('custom-page').length).toBe(0);
    expect(node.queryAllByRole('foo-bar-page').length).toBe(0);
    expect(node.queryAllByRole('foo-page').length).toBe(1);
  });

  it('goes exactly to the page on "/bar"', () => {
    const node = mountWithRouter(<PiralRoutes NotFound={StubNotFound} RouteSwitch={DefaultRouteSwitch} />, '/bar');
    expect(node.queryAllByRole('home').length).toBe(0);
    expect(node.queryAllByRole('not-found').length).toBe(0);
    expect(node.queryAllByRole('custom-page').length).toBe(0);
    expect(node.queryAllByRole('foo-bar-page').length).toBe(0);
    expect(node.queryAllByRole('bar-page').length).toBe(1);
  });
});
