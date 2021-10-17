function computePath() {
  try {
    throw new Error();
  } catch (t) {
    const e = ('' + t.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (e) {
      return e[0].replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^\/]+$/, '$1') + '/';
    }
  }

  return '/';
}

export const __bundleUrl__ = computePath();
