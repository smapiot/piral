function compareObjects(a: any, b: any) {
  for (const i in a) {
    if (!(i in b)) {
      return false;
    }
  }

  for (const i in b) {
    if (!compare(a[i], b[i])) {
      return false;
    }
  }

  return true;
}

export function compare<T>(a: T, b: T) {
  if (a !== b) {
    const ta = typeof a;
    const tb = typeof b;

    if (ta === tb && ta === 'object' && a && b) {
      return compareObjects(a, b);
    }

    return false;
  }

  return true;
}
