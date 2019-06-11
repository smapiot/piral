import { Atom, deref } from '@dbeining/react-atom';
import { readDataItem, readDataValue, resetData, tryWriteDataItem, writeDataItem } from './data';

describe('Data Actions Module', () => {
  it('readDataItem reads the current item', () => {
    const state = Atom.of({
      foo: 5,
      app: {
        data: {
          foo: 10,
        },
      },
    });
    const value = readDataItem.call(state, 'foo');
    expect(value).toBe(10);
  });
  it('readDataValue reads the current value', () => {
    const state = Atom.of({
      foo: 5,
      app: {
        data: {
          foo: {
            value: 15,
          },
        },
      },
    });
    const value = readDataValue.call(state, 'foo');
    expect(value).toBe(15);
  });

  it('resetData clears all items', () => {
    const state = Atom.of({
      foo: 5,
      app: {
        data: {
          foo: 10,
          bar: [5],
        },
      },
    });
    resetData.call(state);
    expect(deref(state)).toEqual({
      foo: 5,
      app: {
        data: {},
      },
    });
  });

  it('writeDataItem adds a new data item', () => {
    const state = Atom.of({
      foo: 5,
      app: {
        data: {
          foo: 10,
          bar: [5],
        },
      },
    });
    writeDataItem.call(state, 'fi', 0);
    expect(deref(state)).toEqual({
      foo: 5,
      app: {
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
      },
    });
  });

  it('writeDataItem overwrites an existing data item', () => {
    const state = Atom.of({
      foo: 5,
      app: {
        data: {
          foo: 10,
          bar: [5],
        },
      },
    });
    writeDataItem.call(state, 'bar', 0);
    expect(deref(state)).toEqual({
      foo: 5,
      app: {
        data: {
          foo: 10,
          bar: {
            value: 0,
            owner: undefined,
            target: undefined,
            expires: undefined,
          },
        },
      },
    });
  });

  it('writeDataItem removes an existing data item', () => {
    const state = Atom.of({
      foo: 5,
      app: {
        data: {
          foo: 10,
          bar: [5],
        },
      },
    });
    writeDataItem.call(state, 'bar', null);
    expect(deref(state)).toEqual({
      foo: 5,
      app: {
        data: {
          foo: 10,
        },
      },
    });
  });

  it('tryWriteDataItem can write new item', () => {
    const state = Atom.of({
      foo: 5,
      app: {
        data: {
          foo: 10,
        },
      },
    });
    const success = tryWriteDataItem.call(state, 'bar', 10, 'me');
    expect(success).toBe(true);
  });

  it('tryWriteDataItem can overwrite item if owner', () => {
    const state = Atom.of({
      foo: 5,
      app: {
        data: {
          foo: 10,
          bar: {
            owner: 'me',
            value: 5,
          },
        },
      },
    });
    const success = tryWriteDataItem.call(state, 'bar', 10, 'me');
    expect(success).toBe(true);
  });

  it('tryWriteDataItem can not overwrite item if not owner', () => {
    const state = Atom.of({
      foo: 5,
      app: {
        data: {
          foo: 10,
          bar: {
            owner: 'you',
            value: 5,
          },
        },
      },
    });
    const success = tryWriteDataItem.call(state, 'bar', 10, 'me');
    expect(success).toBe(false);
  });
});
