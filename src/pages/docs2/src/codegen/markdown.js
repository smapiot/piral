const YAML = require('yaml');
const MarkdownIt = require('markdown-it');
const markdownItAbbr = require('markdown-it-abbr');
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
const { docRef, imgRef } = require('./utils');

function render(file) {
  const content = readFileSync(file, 'utf8');
  const result = {
    meta: {},
    content: '',
  };
  const md = new MarkdownIt({
    replaceLink(link) {
      if (/\.md$/.test(link)) {
        return docRef(link, file);
      } else if (/\.(png|jpg|jpeg|gif)$/.test(link)) {
        return imgRef(link, file);
      } else if (/\.svg$/.test(link)) {
        return `${imgRef(link, file)}?sanitize=true`;
      }

      return link;
    },
  })
    .use(markdownItAbbr)
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
  return result;
}

module.exports = {
  render,
};
