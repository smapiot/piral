export function getTileClass(cols: number, rows: number) {
  const baseCls = 'pi-tile';

  if (cols > 3 && rows > 3) {
    return `${baseCls} large`;
  } else if (cols > 3) {
    return `${baseCls} wide`;
  } else if (cols > 1 && rows > 1) {
    return `${baseCls} medium`;
  } else if (cols === 1 || rows === 1) {
    return `${baseCls} small`;
  }

  return baseCls;
}
