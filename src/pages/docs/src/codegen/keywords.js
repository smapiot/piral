const { extract } = require('keyword-extractor');

function normalize(keyword) {
  if (keyword.startsWith('```')) {
    return '';
  }

  if (/^\*\*.*\*\*$/.test(keyword)) {
    keyword = keyword.substr(2, keyword.length - 4);
  }

  if (/^`.*`$/.test(keyword) || /^\*.*\*$/.test(keyword)) {
    keyword = keyword.substr(1, keyword.length - 2);
  }

  if (keyword.startsWith('--') && keyword.length > 2) {
    keyword = keyword.substr(2);
  }

  if (keyword.startsWith('[')) {
    keyword = keyword.substr(1);
  }

  if (keyword.indexOf(']') !== -1) {
    keyword = keyword.substr(0, keyword.indexOf(']'));
  }

  if (/^[a-z\-]+$/.test(keyword)) {
    return keyword;
  }

  return '';
}

function count(results, keyword) {
  if (results[keyword]) {
    results[keyword]++;
  } else if (keyword) {
    results[keyword] = 1;
  }
}

function findKeywords(sentence) {
  const result = extract(sentence, {
    language: 'english',
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: false,
  });

  const results = {};

  for (const item of result) {
    const root = normalize(item);
    const keywords = root.split(/[\-\/\.]/g);

    for (const keyword of keywords) {
      count(results, keyword);
    }

    if (keywords.length > 1) {
      count(results, root);
    }
  }

  return Object.keys(results).map(keyword => ({ keyword, count: results[keyword] }));
}

function getTopKeywords(sentence, max = 10) {
  return findKeywords(sentence)
    .sort((a, b) => a.count - b.count)
    .map(m => m.keyword)
    .slice(0, max);
}

module.exports = {
  getTopKeywords,
  findKeywords,
};
