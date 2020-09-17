import { updateKey } from '../utils';
import { DataStoreTarget, GlobalStateContext } from '../types';

export function resetData(ctx: GlobalStateContext) {
  ctx.dispatch((state) => ({
    ...state,
    data: {},
  }));
}

export function readDataItem(ctx: GlobalStateContext, key: string) {
  return ctx.readState((state) => state.data[key]);
}

export function readDataValue(ctx: GlobalStateContext, key: string) {
  const item = readDataItem(ctx, key);
  return item && item.value;
}

export function writeDataItem(
  ctx: GlobalStateContext,
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
  ctx.dispatch((state) => ({
    ...state,
    data: updateKey(state.data, key, data),
  }));

  ctx.emit('store-data', {
    name: key,
    target,
    value,
    owner,
    expires,
  });
}

export function tryWriteDataItem(
  ctx: GlobalStateContext,
  key: string,
  value: any,
  owner: string,
  target: DataStoreTarget,
  expires: number,
) {
  const item = readDataItem(ctx, key);

  if (item && item.owner !== owner) {
    console.error(
      `Invalid data write to '${key}'. This item currently belongs to '${item.owner}' (write attempted from '${owner}'). The action has been ignored.`,
    );
    return false;
  }

  writeDataItem(ctx, key, value, owner, target, expires);
  return true;
}
