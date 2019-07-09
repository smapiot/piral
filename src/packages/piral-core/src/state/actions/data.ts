import { swap, Atom, deref, DeepImmutableObject } from '@dbeining/react-atom';
import { updateKey } from '../../utils';
import { GlobalState, SharedDataItem, DataStoreTarget } from '../../types';

export function resetData(ctx: Atom<GlobalState>) {
  swap(ctx, state => ({
    ...state,
    app: {
      ...state.app,
      data: {},
    },
  }));
}

export function readDataItem(ctx: Atom<GlobalState>, key: string) {
  return deref(ctx).app.data[key];
}

export function readDataValue(ctx: Atom<GlobalState>, key: string) {
  const item = readDataItem(ctx, key);
  return item && item.value;
}

export function writeDataItem(
  ctx: Atom<GlobalState>,
  key: string,
  value: any,
  owner: string,
  target: DataStoreTarget,
  expires: number,
) {
  const isNull = !value && typeof value === 'object';
  const data = isNull
    ? value
    : {
        value,
        owner,
        target,
        expires,
      };
  swap(ctx, state => ({
    ...state,
    app: {
      ...state.app,
      data: updateKey<SharedDataItem>(state.app.data, key, data),
    },
  }));
}

export function tryWriteDataItem(
  ctx: Atom<GlobalState>,
  key: string,
  value: any,
  owner: string,
  target: DataStoreTarget,
  expires: number,
) {
  const item: DeepImmutableObject<SharedDataItem> = readDataItem(ctx, key);

  if (item && item.owner !== owner) {
    console.error(
      `Invalid data write to '${key}'. This item currently belongs to '${
        item.owner
      }' (write attempted from '${owner}'). The action has been ignored.`,
    );
    return false;
  }

  writeDataItem(ctx, key, value, owner, target, expires);
  return true;
}
