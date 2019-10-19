import { swap, Atom, deref, DeepImmutableObject } from '@dbeining/react-atom';
import { updateKey } from '../../utils';
import { GlobalState, SharedDataItem, DataStoreTarget, EventEmitter } from '../../types';

export function resetData(ctx: Atom<GlobalState>) {
  swap(ctx, state => ({
    ...state,
    data: {},
  }));
}

export function readDataItem(ctx: Atom<GlobalState>, key: string) {
  return deref(ctx).data[key];
}

export function readDataValue(ctx: Atom<GlobalState>, key: string) {
  const item = readDataItem(ctx, key);
  return item && item.value;
}

export function writeDataItem(
  this: EventEmitter,
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
    data: updateKey<SharedDataItem>(state.data, key, data),
  }));

  this.emit('store-data', {
    name,
    target,
    value,
    owner,
    expires,
  });
}

export function tryWriteDataItem(
  this: EventEmitter,
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
      `Invalid data write to '${key}'. This item currently belongs to '${item.owner}' (write attempted from '${owner}'). The action has been ignored.`,
    );
    return false;
  }

  writeDataItem.call(this, ctx, key, value, owner, target, expires);
  return true;
}
