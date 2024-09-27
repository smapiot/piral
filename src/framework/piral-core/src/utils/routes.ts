const defaultDelimiter = escapeString('/');
const pathExpr = new RegExp(
  [
    '(\\\\.)',
    '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))',
  ].join('|'),
  'g',
);

function escapeString(str: string) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1');
}

function escapeGroup(group: string) {
  return group.replace(/([=!:$\/()])/g, '\\$1');
}

type Token =
  | string
  | {
      name: string;
      prefix: string;
      delimiter: string;
      optional: boolean;
      repeat: boolean;
      partial: boolean;
      asterisk: boolean;
      pattern: string;
    };

function parse(str: string) {
  const tokens: Array<Token> = [];
  let key = 0;
  let index = 0;
  let path = '';
  let res: RegExpExecArray;

  while ((res = pathExpr.exec(str)) !== null) {
    const m = res[0];
    const escaped = res[1];
    const offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue;
    }

    const next = str[index];
    const prefix = res[2];
    const name = res[3];
    const capture = res[4];
    const group = res[5];
    const modifier = res[6];
    const asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    const partial = prefix != null && next != null && next !== prefix;
    const repeat = modifier === '+' || modifier === '*';
    const optional = modifier === '?' || modifier === '*';
    const delimiter = res[2] || '/';
    const pattern = capture || group;

    tokens.push({
      name: name || `${key++}`,
      prefix: prefix || '',
      delimiter,
      optional,
      repeat,
      partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?',
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substring(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens;
}

function tokensToRegExp(tokens: Array<Token>) {
  let route = '';

  for (const token of tokens) {
    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      const prefix = escapeString(token.prefix);
      let capture = '(?:' + token.pattern + ')';

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  const endsWithDelimiter = route.slice(-defaultDelimiter.length) === defaultDelimiter;
  const path = endsWithDelimiter ? route.slice(0, -defaultDelimiter.length) : route;
  return new RegExp(`^${path}(?:${defaultDelimiter}(?=$))?$`, 'i');
}

function stringToRegexp(path: string) {
  return tokensToRegExp(parse(path));
}

export function createRouteMatcher(path: string): RegExp {
  return stringToRegexp(path);
}
