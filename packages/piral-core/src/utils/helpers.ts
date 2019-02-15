import { Dict } from '../types';

export function prependItem<T>(items: Array<T>, item: T) {
  return [item, ...(items || [])];
}

export function appendItem<T>(items: Array<T>, item: T) {
  return [...(items || []), item];
}

export function excludeItem<T>(items: Array<T>, item: T) {
  return (items || []).filter(m => m !== item);
}

export function excludeOn<T>(items: Array<T>, predicate: (item: T) => boolean) {
  return (items || []).filter(m => !predicate(m));
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
