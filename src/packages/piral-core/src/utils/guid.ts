function rand(c: 'x' | 'y') {
  const r = (Math.random() * 16) | 0;
  const v = c === 'x' ? r : (r & 0x3) | 0x8;
  return v.toString(16);
}

export function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, rand);
}

export function buildName(prefix: string, name: string | number) {
  return `${prefix}://${name}`;
}
