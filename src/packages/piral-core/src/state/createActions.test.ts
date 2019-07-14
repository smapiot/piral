import { createActions } from './createActions';
import { createListener } from '../modules/events';

jest.mock('./actions', () => ({
  a(arg) {
    return arg;
  },
  b() {
    return 'foo';
  },
}));

describe('Create Actions Module', () => {
  it('createActions works with all actions', () => {
    const events = createListener(undefined);
    const actions = createActions('abc' as any, events);
    expect(Object.keys(actions)).toEqual(['state', 'a', 'b']);
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
});
