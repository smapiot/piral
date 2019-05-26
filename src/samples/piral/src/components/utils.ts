export function withClass(baseClass: string, optional: boolean | string) {
  if (!optional || typeof optional !== 'string') {
    return baseClass;
  }

  return `${baseClass} ${optional}`;
}
