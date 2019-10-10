import { Dict } from '../types';

// tslint:disable-next-line
export const removeIndicator = null;

export function prependItem<T>(items: Array<T>, item: T) {
  return [item, ...(items || [])];
}

export function appendItem<T>(items: Array<T>, item: T) {
  return [...(items || []), item];
}

export function prependItems<T>(items: Array<T>, newItems: Array<T>) {
  return [...newItems, ...(items || [])];
}

export function appendItems<T>(items: Array<T>, newItems: Array<T>) {
  return [...(items || []), ...newItems];
}

export function excludeItem<T>(items: Array<T>, item: T) {
  return (items || []).filter(m => m !== item);
}

export function includeItem<T>(items: Array<T>, item: T) {
  return prependItem(excludeItem(items, item), item);
}

export function excludeOn<T>(items: Array<T>, predicate: (item: T) => boolean) {
  return (items || []).filter(m => !predicate(m));
}

export function updateKey<T>(obj: Dict<T>, key: string, value: T): Dict<T> {
  return value === removeIndicator ? withoutKey(obj, key) : withKey(obj, key, value);
}

export function withKey<T>(obj: Dict<T>, key: string, value: T): Dict<T> {
  return {
    ...obj,
    [key]: value,
  };
}

export function withoutKey<T>(obj: Dict<T>, key: string): Dict<T> {
  const { [key]: _, ...newObj } = obj || {};
  return newObj;
}
