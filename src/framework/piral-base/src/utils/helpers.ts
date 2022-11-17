export function isfunc(f: any): f is Function {
  return typeof f === 'function';
}

export function callfunc<T extends (...args: Array<any>) => void>(f: T, ...args: Parameters<T>) {
  isfunc(f) && f(...args);
}

export function promisify<T = void>(value?: T | PromiseLike<T>) {
  return Promise.resolve<T>(value);
}

export function getBasePath(link: string) {
  if (link) {
    const idx = link.lastIndexOf('/');
    return link.substring(0, idx + 1);
  }

  return link;
}
