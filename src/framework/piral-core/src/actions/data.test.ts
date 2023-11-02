/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect } from 'vitest';
import { createListener } from 'piral-base';
import { readDataItem, readDataValue, resetData, tryWriteDataItem, writeDataItem } from './data';

describe('Data Actions Module', () => {
  it('readDataItem reads the current item', () => {
    const state = create(() => ({
      foo: 5,
      data: {
        foo: 10,
      },
    }));
    const ctx: any = {
      state,
      dispatch(update) {
        state.setState(update(state.getState()));
      },
      readState(select) {
        return select(state.getState());
      },
    };
    const value = readDataItem(ctx, 'foo');
    expect(value).toBe(10);
  });

  it('readDataValue reads the current value', () => {
    const state = create(() => ({
      foo: 5,
      data: {
        foo: {
          value: 15,
        },
      },
    }));
    const ctx: any = {
      state,
      dispatch(update) {
        state.setState(update(state.getState()));
      },
      readState(select) {
        return select(state.getState());
      },
    };
    const value = readDataValue(ctx, 'foo');
    expect(value).toBe(15);
  });

  it('resetData clears all items', () => {
    const state = create(() => ({
      foo: 5,
      data: {
        foo: 10,
        bar: [5],
      },
    }));
    const ctx: any = {
      state,
      dispatch(update) {
        state.setState(update(state.getState()));
      },
      readState(select) {
        return select(state.getState());
      },
    };
    resetData(ctx);
    expect(state.getState()).toEqual({
      foo: 5,
      data: {},
    });
  });

  it('writeDataItem adds a new data item', () => {
    const state = create(() => ({
      foo: 5,
      data: {
        foo: 10,
        bar: [5],
      },
    }));
    const ctx: any = Object.assign(createListener(undefined), {
      state,
      dispatch(update) {
        state.setState(update(state.getState()));
      },
      readState(select) {
        return select(state.getState());
      },
    });
    writeDataItem(ctx, 'fi', 0, undefined, undefined, undefined);
    expect(state.getState()).toEqual({
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
    const state = create(() => ({
      foo: 5,
      data: {
        foo: 10,
        bar: [5],
      },
    }));
    const ctx: any = Object.assign(createListener(undefined), {
      state,
      dispatch(update) {
        state.setState(update(state.getState()));
      },
      readState(select) {
        return select(state.getState());
      },
    });
    writeDataItem(ctx, 'bar', 0, undefined, undefined, undefined);
    expect(state.getState()).toEqual({
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
    const state = create(() => ({
      foo: 5,
      data: {
        foo: 10,
        bar: [5],
      },
    }));
    const ctx: any = Object.assign(createListener(undefined), {
      state,
      dispatch(update) {
        state.setState(update(state.getState()));
      },
      readState(select) {
        return select(state.getState());
      },
    });
    writeDataItem(ctx, 'bar', null, undefined, undefined, undefined);
    expect(state.getState()).toEqual({
      foo: 5,
      data: {
        foo: 10,
      },
    });
  });

  it('tryWriteDataItem can write new item', () => {
    const state = create(() => ({
      foo: 5,
      data: {
        foo: 10,
      },
    }));
    const ctx: any = Object.assign(createListener(undefined), {
      state,
      dispatch(update) {
        state.setState(update(state.getState()));
      },
      readState(select) {
        return select(state.getState());
      },
    });
    const success = tryWriteDataItem(ctx, 'bar', 10, 'me', undefined, undefined);
    expect(success).toBe(true);
  });

  it('tryWriteDataItem can overwrite item if owner', () => {
    const state = create(() => ({
      foo: 5,
      data: {
        foo: 10,
        bar: {
          owner: 'me',
          value: 5,
        },
      },
    }));
    const ctx: any = Object.assign(createListener(undefined), {
      state,
      dispatch(update) {
        state.setState(update(state.getState()));
      },
      readState(select) {
        return select(state.getState());
      },
    });
    const success = tryWriteDataItem(ctx, 'bar', 10, 'me', undefined, undefined);
    expect(success).toBe(true);
    expect(state.getState().data.bar.value).toBe(10);
  });

  it('tryWriteDataItem can not overwrite item if not owner', () => {
    const state = create(() => ({
      foo: 5,
      data: {
        foo: 10,
        bar: {
          owner: 'you',
          value: 5,
        },
      },
    }));
    const ctx: any = Object.assign(createListener(undefined), {
      state,
      dispatch(update) {
        state.setState(update(state.getState()));
      },
      readState(select) {
        return select(state.getState());
      },
    });
    const success = tryWriteDataItem(ctx, 'bar', 10, 'me', undefined, undefined);
    expect(success).toBe(false);
    expect(state.getState().data.bar.value).toBe(5);
  });
});
