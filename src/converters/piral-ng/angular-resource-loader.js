// Rewrites `templateUrl`/`styleUrls`/`styleUrl` in `@Component()` metadata to inline
// `require()` calls, since Angular's JIT compiler needs the actual template/styles at
// class-decoration time - it does not fetch `templateUrl`/`styleUrls` over the network
// unless `resolveComponentResources()` was run, which we don't wire up here.
const templateUrlRegex = /templateUrl\s*:\s*(['"`])((?:\\.|(?!\1).)*)\1/g;
const styleUrlRegex = /styleUrl\s*:\s*(['"`])((?:\\.|(?!\1).)*)\1/g;
const styleUrlsRegex = /styleUrls\s*:\s*\[([^\]]*)\]/g;
const stringLiteralRegex = /(['"`])((?:\\.|(?!\1).)*)\1/g;

module.exports = function angularResourceLoader(source) {
  source = source.replace(templateUrlRegex, (_, quote, url) => `template: require(${quote}${url}${quote})`);

  source = source.replace(styleUrlRegex, (_, quote, url) => `styles: [require(${quote}${url}${quote})]`);

  source = source.replace(styleUrlsRegex, (_, urls) => {
    const requires = [...urls.matchAll(stringLiteralRegex)].map(([, quote, url]) => `require(${quote}${url}${quote})`);
    return `styles: [${requires.join(', ')}]`;
  });

  return source;
};
