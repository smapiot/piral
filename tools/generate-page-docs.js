const { resolve, dirname, relative } = require('path');
const { readFileSync, writeFileSync, readdirSync } = require('fs');

const nl = '\n';
const intend = '    ';
const autoGenMessage = 'auto-generated';
const startMarker = `{/* start:${autoGenMessage} */}`;
const endMarker = `{/* end:${autoGenMessage} */}`;
const refFormat = /\- \[(.*)\]\((.*)\)/g;

const rootDocsFolder = resolve(__dirname, '..', 'docs');
const rootScriptsFolder = resolve(__dirname, '..', 'packages', 'page-docs', 'src', 'scripts');

const sources = [
  {
    md: './README',
    tsx: './documentation/Content',
    mode: 'mdlinks',
    name: 'Md',

  },
  {
    md: './questions/README',
    tsx: './questions/Content',
    mode: 'mdlinks',
    name: 'Mdq',
  },
  {
    md: './commands/README',
    tsx: './tooling/Content',
    mode: 'mdlinks',
    name: 'Md',
  },
  {
    dir: './types',
    tsx: './types/Content',
    mode: 'types',
  },
];

function generateMdSection({ title, link, comp }) {
  const id = title.replace(/\s/g, '-').toLowerCase();
  const relLink = relative(rootDocsFolder, link);
  return `<Section id="section-${id}" title="${title}">
  <${comp}>{require('../../../../../docs/${relLink}')}</${comp}>
  <EditSection link="${relLink}" />
</Section>`.split(nl).join(`${nl}${intend}`);
}

function generateTiSection({ file }) {
  const name = file.substr(0, file.indexOf('.'));
  return `<Section id="section-${name}" title="${name}">
  <Ti>{require('../../../../../docs/types/${name}.json')}</Ti>
</Section>`.split(nl).join(`${nl}${intend}`);
}

function generateSections(results, genSec) {
  return results.map(genSec).join(`${nl}${intend}`);
}

function replaceBody(content, body) {
  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker, startIndex);
  const head = content.substring(0, startIndex + startMarker.length);
  const rest = content.substring(endIndex);
  return head + nl + intend + body + nl + intend + rest;
}

const modes = {
  mdlinks(source) {
    const mdPath = resolve(rootDocsFolder, `${source.md}.md`);
    const mdContent = readFileSync(mdPath, 'utf8');
    const results = [];

    do {
      const result = refFormat.exec(mdContent);

      if (!result) {
        break;
      }

      const title = result[1];
      const link = resolve(dirname(mdPath), result[2]);
      results.push({ title, link, comp: source.name });
    } while (true);

    return generateSections(results, generateMdSection);
  },
  types(source) {
    const dirPath = resolve(rootDocsFolder, source.dir);
    const files = readdirSync(dirPath);
    return generateSections(files.map(file => ({ file })), generateTiSection);
  },
};

function generatePageDocs() {
  for (const source of sources) {
    const tsxPath = resolve(rootScriptsFolder, `${source.tsx}.tsx`);
    const tsxContent = readFileSync(tsxPath, 'utf8');
    const body = modes[source.mode](source);
    const newTsxContent = replaceBody(tsxContent, body);
    writeFileSync(tsxPath, newTsxContent, 'utf8');
  }
}

if (require.main === module) {
  generatePageDocs();
  console.log('Page documentation generated!');
} else {
  module.exports = generatePageDocs;
}
