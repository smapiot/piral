import { Atom, deref, swap } from '@dbeining/react-atom';
import { createListener } from 'piral-base';
import { readDataItem, readDataValue, resetData, tryWriteDataItem, writeDataItem } from './data';

describe('Data Actions Module', () => {
  it('readDataItem reads the current item', () => {
    const state = Atom.of({
      foo: 5,
      data: {
        foo: 10,
      },
    });
    const ctx: any = {
      state,
      dispatch(update) {
        swap(state, update);
      },
      readState(select) {
        return select(deref(state));
      },
    };
    const value = readDataItem(ctx, 'foo');
    expect(value).toBe(10);
  });

  it('readDataValue reads the current value', () => {
    const state = Atom.of({
      foo: 5,
      data: {
        foo: {
          value: 15,
        },
      },
    });
    const ctx: any = {
      state,
      dispatch(update) {
        swap(state, update);
      },
      readState(select) {
        return select(deref(state));
      },
    };
    const value = readDataValue(ctx, 'foo');
    expect(value).toBe(15);
  });

  it('resetData clears all items', () => {
    const state = Atom.of({
      foo: 5,
      data: {
        foo: 10,
        bar: [5],
      },
    });
    const ctx: any = {
      state,
      dispatch(update) {
        swap(state, update);
      },
      readState(select) {
        return select(deref(state));
      },
    };
    resetData(ctx);
    expect(deref(state)).toEqual({
      foo: 5,
      data: {},
    });
  });

  it('writeDataItem adds a new data item', () => {
    const state = Atom.of({
      foo: 5,
      data: {
        foo: 10,
        bar: [5],
      },
    });
    const ctx: any = Object.assign(createListener(undefined), {
      state,
      dispatch(update) {
        swap(state, update);
      },
      readState(select) {
        return select(deref(state));
      },
    });
    writeDataItem(ctx, 'fi', 0);
    expect(deref(state)).toEqual({
      foo: 5,
      data: {
        foo: 10,
        bar: [5],
        fi: {
          value: 0,
          owner: undefined,
          target: undefined,
          expires: undefined,
        },
      },
    });
  });

  it('writeDataItem overwrites an existing data item', () => {
    const state = Atom.of({
      foo: 5,
      data: {
        foo: 10,
        bar: [5],
      },
    });
    const ctx: any = Object.assign(createListener(undefined), {
      state,
      dispatch(update) {
        swap(state, update);
      },
      readState(select) {
        return select(deref(state));
      },
    });
    writeDataItem(ctx, 'bar', 0);
    expect(deref(state)).toEqual({
      foo: 5,
      data: {
        foo: 10,
        bar: {
          value: 0,
          owner: undefined,
          target: undefined,
          expires: undefined,
        },
      },
    });
  });

  it('writeDataItem removes an existing data item', () => {
    const state = Atom.of({
      foo: 5,
      data: {
        foo: 10,
        bar: [5],
      },
    });
    const ctx: any = Object.assign(createListener(undefined), {
      state,
      dispatch(update) {
        swap(state, update);
      },
      readState(select) {
        return select(deref(state));
      },
    });
    writeDataItem(ctx, 'bar', null);
    expect(deref(state)).toEqual({
      foo: 5,
      data: {
        foo: 10,
      },
    });
  });

  it('tryWriteDataItem can write new item', () => {
    const state = Atom.of({
      foo: 5,
      data: {
        foo: 10,
      },
    });
    const ctx: any = Object.assign(createListener(undefined), {
      state,
      dispatch(update) {
        swap(state, update);
      },
      readState(select) {
        return select(deref(state));
      },
    });
    const success = tryWriteDataItem(ctx, 'bar', 10, 'me');
    expect(success).toBe(true);
  });

  it('tryWriteDataItem can overwrite item if owner', () => {
    const state = Atom.of({
      foo: 5,
      data: {
        foo: 10,
        bar: {
          owner: 'me',
          value: 5,
        },
      },
    });
    const ctx: any = Object.assign(createListener(undefined), {
      state,
      dispatch(update) {
        swap(state, update);
      },
      readState(select) {
        return select(deref(state));
      },
    });
    const success = tryWriteDataItem(ctx, 'bar', 10, 'me');
    expect(success).toBe(true);
    expect(deref(state).data.bar.value).toBe(10);
  });

  it('tryWriteDataItem can not overwrite item if not owner', () => {
    const state = Atom.of({
      foo: 5,
      data: {
        foo: 10,
        bar: {
          owner: 'you',
          value: 5,
        },
      },
    });
    const ctx: any = Object.assign(createListener(undefined), {
      state,
      dispatch(update) {
        swap(state, update);
      },
      readState(select) {
        return select(deref(state));
      },
    });
    const success = tryWriteDataItem(ctx, 'bar', 10, 'me');
    expect(success).toBe(false);
    expect(deref(state).data.bar.value).toBe(5);
  });
});
