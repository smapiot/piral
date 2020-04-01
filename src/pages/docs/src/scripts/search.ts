const maxResults = 5;
const maxKeywords = 6;

function getBigrams(str: string) {
  const s = str.toLowerCase();
  const v = s.split('');

  for (let i = 0; i < v.length; i++) {
    v[i] = s.slice(i, i + 2);
  }

  return v;
}

function similarity(pairs1: Array<string>, pairs2: Array<string>) {
  if (pairs1.length > 0 && pairs1.length > 0) {
    const union = pairs1.length + pairs2.length;
    let hits = 0;

    for (let x = 0; x < pairs1.length; x++) {
      for (let y = 0; y < pairs2.length; y++) {
        if (pairs1[x] === pairs2[y]) {
          hits++;
        }
      }
    }

    return (2.0 * hits) / union;
  }

  return 0.0;
}

type SearchPages = Array<{
  keywords: Array<{
    keyword: string;
    tokens: Array<string>;
    count: number;
  }>;
  route: string;
  title: string;
  total: number;
}>;

let searchResolver = undefined;
let searchPromise: Promise<SearchPages> = undefined;

function setData(pages: Array<any>) {
  searchResolver(
    pages.map(page => ({
      ...page,
      keywords: page.keywords.map(ks => ({
        ...ks,
        tokens: getBigrams(ks.keyword),
      })),
      total: Math.max(
        1,
        page.keywords.reduce((prev, current) => current.count + prev, 0),
      ),
    })),
  );
}

function startSearch(pages: SearchPages, input: string) {
  const tokens = getBigrams(input);
  const results = pages
    .map(page => {
      const values = page.keywords.map(k => similarity(tokens, k.tokens) * k.count);
      const rating = values.reduce((prev, value) => prev + value, 0) / page.total;
      const keywords = values
        .map((weight, i) => ({ weight, keyword: page.keywords[i].keyword }))
        .filter(m => m.weight > 0)
        .sort((a, b) => b.weight - a.weight)
        .slice(0, maxKeywords)
        .map(m => m.keyword);
      return {
        ...page,
        keywords,
        rating,
      };
    })
    .filter(page => page.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, maxResults)
    .map(page => ({
      url: page.route,
      title: page.title,
      keywords: page.keywords,
      rating: page.rating,
    }));

  postMessage({
    type: 'results',
    results,
  });
}

function loadData() {
  if (!searchPromise) {
    searchPromise = new Promise(resolve => {
      searchResolver = resolve;

      postMessage({
        type: 'load',
      });
    });
  }

  return searchPromise;
}

onmessage = (evt: MessageEvent) => {
  switch (evt.data.type) {
    case 'data':
      return setData(evt.data.pages);
    case 'search':
      return loadData().then(pages => startSearch(pages, evt.data.input));
  }
};
