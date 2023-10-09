const semver =
  /^[v^~<>=]*?(\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+))?(?:-([\da-z\-]+(?:\.[\da-z\-]+)*))?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i;

const acceptsAll = ['*', 'x', '>=0'];

const operatorResMap: Record<string, [number, number?]> = {
  '>': [1],
  '>=': [0, 1],
  '=': [0],
  '<=': [-1, 0],
  '<': [-1],
};

function indexOrEnd(str: string, q: string) {
  return str.indexOf(q) === -1 ? str.length : str.indexOf(q);
}

function splitVersion(v: string) {
  const c = v.replace(/^v/, '').replace(/\+.*$/, '');
  const patchIndex = indexOrEnd(c, '-');
  const arr = c.substring(0, patchIndex).split('.');
  arr.push(c.substring(patchIndex + 1));
  return arr;
}

function parseSegment(v: string) {
  const n = parseInt(v, 10);
  return isNaN(n) ? v : n;
}

function validateAndParse(v: string) {
  const match = v.match(semver);
  match.shift();
  return match;
}

function compareStrings(a: string, b: string) {
  const ap = parseSegment(a);
  const bp = parseSegment(b);

  if (ap > bp) {
    return 1;
  } else if (ap < bp) {
    return -1;
  } else {
    return 0;
  }
}

function compareSegments(a: [string, string], b: [string, string]) {
  for (let i = 0; i < 2; i++) {
    const r = compareStrings(a[i] || '0', b[i] || '0');

    if (r !== 0) {
      return r;
    }
  }

  return 0;
}

function compareVersions(v1: string, v2: string) {
  const s1 = splitVersion(v1);
  const s2 = splitVersion(v2);
  const len = Math.max(s1.length - 1, s2.length - 1);

  for (let i = 0; i < len; i++) {
    const m1 = s1[i] || '0';
    const m2 = s2[i] || '0';

    if (m2 === 'x') {
      return 0;
    }

    const n1 = parseInt(m1, 10);
    const n2 = parseInt(m2, 10);

    if (n1 > n2) {
      return 1;
    } else if (n2 > n1) {
      return -1;
    }
  }

  const sp1 = s1[s1.length - 1];
  const sp2 = s2[s2.length - 1];

  if (sp1 && sp2) {
    const p1 = sp1.split('.').map(parseSegment);
    const p2 = sp2.split('.').map(parseSegment);
    const len = Math.max(p1.length, p2.length);

    for (let i = 0; i < len; i++) {
      if (p1[i] === undefined || (typeof p2[i] === 'string' && typeof p1[i] === 'number')) {
        return -1;
      } else if (p2[i] === undefined || (typeof p1[i] === 'string' && typeof p2[i] === 'number')) {
        return 1;
      } else if (p1[i] > p2[i]) {
        return 1;
      } else if (p2[i] > p1[i]) {
        return -1;
      }
    }
  } else if (sp1 || sp2) {
    return sp1 ? -1 : 1;
  }

  return 0;
}

function compare(v1: string, v2: string, operator: string) {
  // since result of compareVersions can only be -1 or 0 or 1
  // a simple map can be used to replace switch
  const res = compareVersions(v1, v2);
  return operatorResMap[operator].indexOf(res) > -1;
}

export function validate(version: string) {
  return acceptsAll.includes(version) || semver.test(version);
}

export function satisfies(v: string, r: string) {
  if (!acceptsAll.includes(r)) {
    // if no range operator then "="
    const match = r.match(/^([<>=~^]+)/);
    const op = match ? match[1] : '=';

    // if gt/lt/eq then operator compare
    if (op !== '^' && op !== '~') {
      return compare(v, r, op);
    }

    // else range of either "~" or "^" is assumed
    const [v1, v2, v3] = validateAndParse(v);
    const [m1, m2, m3] = validateAndParse(r);

    if (compareStrings(v1, m1) !== 0) {
      return false;
    } else if (op === '^') {
      return compareSegments([v2, v3], [m2, m3]) >= 0;
    } else if (compareStrings(v2, m2) !== 0) {
      return false;
    }

    return compareStrings(v3, m3) >= 0;
  }

  return true;
}
