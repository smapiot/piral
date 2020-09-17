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
  return (items || []).filter((m) => m !== item);
}

export function includeItem<T>(items: Array<T>, item: T) {
  return prependItem(excludeItem(items, item), item);
}

export function replaceOrAddItem<T>(items: Array<T>, item: T, predicate: (item: T) => boolean) {
  const newItems = [...(items || [])];

  for (let i = 0; i < newItems.length; i++) {
    if (predicate(newItems[i])) {
      newItems[i] = item;
      return newItems;
    }
  }

  newItems.push(item);
  return newItems;
}

export function removeNested<T, U = any>(obj: T, predicate: (item: U) => boolean): T {
  return Object.keys(obj).reduce((entries, key) => {
    const item = obj[key];
    entries[key] = Object.keys(item).reduce((all, key) => {
      const value = item[key];

      if (Array.isArray(value)) {
        all[key] = excludeOn(value, predicate);
      } else if (!value || !predicate(value)) {
        all[key] = value;
      }

      return all;
    }, {} as any);

    return entries;
  }, {} as T);
}

export function excludeOn<T>(items: Array<T>, predicate: (item: T) => boolean) {
  return (items || []).filter((m) => !predicate(m));
}

export function updateKey<T, TKey extends keyof T>(obj: T, key: TKey, value: T[TKey]): T {
  return value === removeIndicator ? withoutKey(obj, key) : withKey(obj, key, value);
}

export function withKey<T, TKey extends keyof T>(obj: T, key: TKey, value: T[TKey]): T {
  return {
    ...obj,
    [key]: value,
  };
}

export function withoutKey<T, TKey extends keyof T>(obj: T, key: TKey): T {
  const { [key]: _, ...newObj } = obj || {};
  return newObj as any;
}
