function isMergeableObject(val: any) {
  const nonNullObject = val && typeof val === 'object';

  return (
    nonNullObject &&
    Object.prototype.toString.call(val) !== '[object RegExp]' &&
    Object.prototype.toString.call(val) !== '[object Date]'
  );
}

function emptyTarget(val: any) {
  return Array.isArray(val) ? [] : {};
}

function cloneIfNecessary(value: any) {
  switch (typeof value) {
    case 'boolean':
    case 'number':
    case 'string':
    case 'symbol':
    case 'undefined':
      return value;
  }

  return deepMerge(emptyTarget(value), value);
}

function defaultArrayMerge(target: Array<any>, source: Array<any>) {
  const destination = target.slice();

  source.forEach((e, i) => {
    if (typeof destination[i] === 'undefined') {
      destination[i] = cloneIfNecessary(e);
    } else if (isMergeableObject(e)) {
      destination[i] = deepMerge(target[i], e);
    } else if (target.indexOf(e) === -1) {
      destination.push(cloneIfNecessary(e));
    }
  });

  return destination;
}

function mergeObject(target: any, source: any) {
  const destination = {};

  if (isMergeableObject(target)) {
    Object.keys(target).forEach((key) => {
      destination[key] = cloneIfNecessary(target[key]);
    });
  }

  Object.keys(source).forEach((key) => {
    if (!isMergeableObject(source[key]) || !target[key]) {
      destination[key] = cloneIfNecessary(source[key]);
    } else {
      destination[key] = deepMerge(target[key], source[key]);
    }
  });

  return destination;
}

export function deepMerge(target: any, source: any) {
  if (Array.isArray(source)) {
    return Array.isArray(target) ? defaultArrayMerge(target, source) : cloneIfNecessary(source);
  }

  return mergeObject(target, source);
}
