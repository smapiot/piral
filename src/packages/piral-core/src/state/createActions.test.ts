import { createActions } from './createActions';

jest.mock('./actions', () => ({
  a(this: any) {
    return this;
  },
  b(this: any) {
    return 'foo';
  },
}));

describe('Create Actions Module', () => {
  it('createActions works with all actions', () => {
    const actions = createActions('abc' as any);
    expect(Object.keys(actions)).toEqual(['a', 'b']);
  });

  it('createActions binds against given context', () => {
    const actions = createActions('abc' as any);
    expect((actions as any).a()).toEqual('abc');
    expect((actions as any).b()).toEqual('foo');
  });

  it('createActions returns unique instances', () => {
    const actions1 = createActions('abc' as any);
    const actions2 = createActions('bdf' as any);
    expect((actions1 as any).a()).toEqual('abc');
    expect((actions2 as any).a()).toEqual('bdf');
  });
});
