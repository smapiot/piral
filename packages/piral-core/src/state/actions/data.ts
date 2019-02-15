import { swap, Atom, deref, DeepImmutableObject } from '@dbeining/react-atom';
import { withKey } from '../../utils';
import { GlobalState, SharedDataItem, DataStoreTarget } from '../../types';

export function resetData() {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    app: {
      ...state.app,
      data: {},
    },
  }));
}

export function readDataItem(key: string) {
  const globalState = this as Atom<GlobalState>;
  return deref(globalState).app.data[key];
}

export function readDataValue(key: string) {
  const globalState = this as Atom<GlobalState>;
  const item = readDataItem.call(globalState, key);
  return item && item.value;
}

export function writeDataItem(key: string, value: any, owner: string, target: DataStoreTarget, expires: number) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    app: {
      ...state.app,
      data: withKey<SharedDataItem>(state.app.data, key, {
        value,
        owner,
        target,
        expires,
      }),
    },
  }));
}

export function tryWriteDataItem(key: string, value: any, owner: string, target: DataStoreTarget, expires: number) {
  const globalState = this as Atom<GlobalState>;
  const item: DeepImmutableObject<SharedDataItem> = readDataItem.call(globalState, key);

  if (item && item.owner !== owner) {
    console.error(
      `Invalid data write to '${key}'. This item currently belongs to '${
        item.owner
      }' (write attempted from '${owner}'). The action has been ignored.`,
    );
    return false;
  }

  writeDataItem.call(globalState, key, value, owner, target, expires);
  return true;
}
