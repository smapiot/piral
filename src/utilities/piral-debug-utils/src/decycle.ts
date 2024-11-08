export function decycle(obj: Record<string, any>) {
  const objects = [];
  const paths = [];

  const derez = (value: Record<string, any>, path: string) => {
    const _value = value && value.toJSON instanceof Function ? value.toJSON() : value;

    if (_value === null || _value === undefined) {
      return undefined;
    } else if (typeof _value === 'function') {
      return `<function>`;
    } else if (_value instanceof Error) {
      return `<error>`;
    } else if (_value instanceof Node) {
      return `<node>`;
    } else if (_value['$$typeof'] === Symbol.for('react.element')) {
      return '<react.element>';
    } else if (typeof _value === 'object') {
      for (let i = 0; i < objects.length; i++) {
        if (objects[i] === _value) {
          return { $ref: paths[i] };
        }
      }

      objects.push(_value);
      paths.push(path);

      if (Array.isArray(_value)) {
        const nu = [];

        for (let i = 0; i < _value.length; i += 1) {
          nu[i] = derez(_value[i], `${path}[${i}]`);
        }

        return nu;
      } else {
        const nu = {};

        for (const name in _value) {
          if (Object.prototype.hasOwnProperty.call(_value, name)) {
            nu[name] = derez(_value[name], `${path}[${JSON.stringify(name)}]`);
          }
        }

        return nu;
      }
    } else if (typeof _value === 'symbol') {
      return '<symbol>';
    } else if (typeof _value === 'bigint') {
      return '<bigint>';
    }

    return _value;
  };

  return derez(obj, '$');
}
