import { sep } from 'path';

export function onlyUnique<T>(value: T, index: number, self: Array<T>) {
  return self.indexOf(value) === index;
}

export function onlyUniqueFiles(value: string, index: number, self: Array<string>) {
  const valueDir = value + sep;

  for (let i = 0; i < index; i++) {
    const other = self[i];

    if (other === value) {
      return false;
    }

    const otherDir = other + sep;

    if (value.startsWith(otherDir)) {
      return false;
    }
  }

  for (let i = index + 1; i < self.length; i++) {
    const other = self[i];

    if (other !== value && valueDir.startsWith(other)) {
      return false;
    }
  }

  return true;
}
