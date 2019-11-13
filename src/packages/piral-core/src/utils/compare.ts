export function compare<T>(a: T, b: T): boolean {
  if (a !== b) {
    let i: any;

    for (i in a) {
      if (!(i in b)) {
        return false;
      }
    }

    for (i in b) {
      if (!compare(a[i], b[i])) {
        return false;
      }
    }
  }

  return true;
}
