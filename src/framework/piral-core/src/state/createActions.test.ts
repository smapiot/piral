/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vitest } from 'vitest';
import { createListener } from 'piral-base';
import { createActions, includeActions } from './createActions';

vitest.mock('../actions', () => ({
  a(arg) {
    return arg.state;
  },
  b() {
    return 'foo';
  },
}));

vitest.mock('../../app.codegen', () => ({
  createNavigation: vitest.fn((publicPath) => ({
    publicPath,
  })),
  publicPath: '/',
}));

describe('Create Actions Module', () => {
  it('createActions works with all actions', () => {
    const events = createListener(undefined);
    const actions = createActions('abc' as any, events);
    expect(Object.keys(actions)).toEqual([
      'on',
      'once',
      'off',
      'emit',
      'apis',
      'converters',
      'navigation',
      'state',
      'a',
      'b',
    ]);
  });

  it('createActions binds against given context', () => {
    const events = createListener(undefined);
    const actions = createActions('abc' as any, events);
    expect((actions as any).a()).toEqual('abc');
    expect((actions as any).b()).toEqual('foo');
  });

  it('createActions returns unique instances', () => {
    const events = createListener(undefined);
    const actions1 = createActions('abc' as any, events);
    const actions2 = createActions('bdf' as any, events);
    expect((actions1 as any).a()).toEqual('abc');
    expect((actions2 as any).a()).toEqual('bdf');
  });

  it('includeActions patches the initial creator', () => {
    const events = createListener(undefined);
    const actions = createActions('abc' as any, events);
    includeActions(actions, {
      c(arg) {
        return arg.state;
      },
      d() {
        return 'bar';
      },
    } as any);
    expect((actions as any).a()).toEqual('abc');
    expect((actions as any).b()).toEqual('foo');
    expect((actions as any).c()).toEqual('abc');
    expect((actions as any).d()).toEqual('bar');
  });
});
