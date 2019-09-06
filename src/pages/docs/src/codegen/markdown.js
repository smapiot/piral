const YAML = require('yaml');
const MarkdownIt = require('markdown-it');
const markdownItAbbr = require('markdown-it-abbr');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItEmoji = require('markdown-it-emoji');
const markdownItFootnote = require('markdown-it-footnote');
const markdownItFrontMatter = require('markdown-it-front-matter');
const markdownItHljs = require('markdown-it-highlightjs');
const markdownItMark = require('markdown-it-mark');
const markdownItReplaceLink = require('markdown-it-replace-link');
const markdownItSmartArrows = require('markdown-it-smartarrows');
const markdownItSub = require('markdown-it-sub');
const markdownItSup = require('markdown-it-sup');
const markdownItVideo = require('markdown-it-video');
const { readFileSync } = require('fs');
const { extname, basename, relative } = require('path');
const { createHash } = require('crypto');
const { docRef, imgRef } = require('./utils');

function computeHash(content) {
  return createHash('sha1')
    .update(content || '')
    .digest('hex');
}

function getMdValue(result) {
  let content = result.content
    .split('`').join('\\`')
    .split('$').join('\\$');
  Object.keys(result.images).forEach(id => {
    const path = result.images[id];
    content = content
      .split(id).join('${require("' + path + '")}');
  });
  return content;
}

function render(file, baseDir = __dirname) {
  const content = readFileSync(file, 'utf8');
  const result = {
    meta: {},
    content: '',
    mdValue: '',
    images: {},
  };
  const md = new MarkdownIt({
    replaceLink(link) {
      if (/\.md$/.test(link)) {
        return docRef(link, file);
      } else if (/\.(png|jpg|jpeg|gif|svg)$/.test(link)) {
        const ext = extname(link);
        const name = basename(link, ext);
        const target = imgRef(link, file);
        const content = readFileSync(target);
        const hash = computeHash(content);
        const id = `${name}_${hash}${ext}`;
        result.images[id] = relative(baseDir, target);
        return id;
      }

      return link;
    },
  })
    .use(markdownItAbbr)
    .use(markdownItAnchor, { level: [1, 2] })
    .use(markdownItEmoji)
    .use(markdownItFootnote)
    .use(markdownItFrontMatter, fm => (result.meta = YAML.parse(fm)))
    .use(markdownItHljs)
    .use(markdownItMark)
    .use(markdownItReplaceLink)
    .use(markdownItSmartArrows)
    .use(markdownItSub)
    .use(markdownItSup)
    .use(markdownItVideo);
  result.content = md.render(content);
  result.mdValue = '`' + getMdValue(result) + '`';
  return result;
}

module.exports = {
  render,
};
