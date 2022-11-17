function compareObjects(a: any, b: any) {
  for (const i in a) {
    if (!(i in b)) {
      return false;
    }
  }

  for (const i in b) {
    if (!isSame(a[i], b[i])) {
      return false;
    }
  }

  return true;
}

function compareArrays(a: Array<any>, b: Array<any>) {
  const l = a.length;

  if (l === b.length) {
    for (let i = 0; i < l; i++) {
      if (!isSame(a[i], b[i])) {
        return false;
      }
    }

    return true;
  }

  return false;
}

export function isSame<T>(a: T, b: T) {
  if (a !== b) {
    const ta = typeof a;
    const tb = typeof b;

    if (ta === tb && ta === 'object' && a && b) {
      if (Array.isArray(a) && Array.isArray(b)) {
        return compareArrays(a, b);
      } else {
        return compareObjects(a, b);
      }
    }

    return false;
  }

  return true;
}
