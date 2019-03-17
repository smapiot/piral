function compareObjects(a: Object, b: Object) {
  const keysOfA = Object.keys(a);
  const keysOfB = Object.keys(b);

  if (keysOfA.length === keysOfB.length) {
    for (const key of keysOfA) {
      if (keysOfB.indexOf(key) === -1) {
        return false;
      } else if (!compare(a[key], b[key])) {
        return false;
      }
    }

    return true;
  }

  return false;
}

function compareArrays(a: Array<any>, b: Array<any>) {
  if (a.length === b.length) {
    for (let i = 0; i < a.length; i++) {
      const ai = a[i];
      const bi = b[i];

      if (!compare(ai, bi)) {
        return false;
      }
    }

    return true;
  }

  return false;
}

export function compare<T>(a: T, b: T) {
  if (a !== b) {
    if (Array.isArray(a) && Array.isArray(b)) {
      return compareArrays(a, b);
    } else if (typeof a === 'object' && typeof b === 'object') {
      return compareObjects(a, b);
    } else {
      return false;
    }
  }

  return true;
}
