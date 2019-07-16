const { resolve, dirname, relative } = require('path');
const { readFileSync, writeFileSync, readdirSync } = require('fs');

const nl = '\n';
const intend = '    ';
const autoGenMessage = 'auto-generated';
const startPlainMarker = `/* start:${autoGenMessage} */`;
const endPlainMarker = `/* end:${autoGenMessage} */`;
const startJsxMarker = `{${startPlainMarker}}`;
const endJsxMarker = `{${endPlainMarker}}`;
const refFormat = /\- \[(.*)\]\((.*)\)/g;

const rootDocsFolder = resolve(__dirname, '..', 'docs');
const rootScriptsFolder = resolve(__dirname, '..', 'src', 'pages', 'docs', 'src', 'scripts');
const relRoot = '../../../../../../docs';
const templates = {};

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
  {
    dir: './specs',
    tsx: './specifications/Overview',
    target: './specifications',
    rootUrl: '/specifications',
    mode: 'pages',
  },
  {
    dir: './guidelines',
    tsx: './guidelines/Overview',
    target: './guidelines',
    rootUrl: '/guidelines',
    mode: 'pages',
  },
];

readdirSync('./templates').forEach(file => {
  const fn = resolve(__dirname, 'templates', file);
  const template = readFileSync(fn, 'utf8');
  const name = file.substr(0, file.indexOf('.'));
  templates[name] = (params, intend = '') => {
    let content = template;

    Object.keys(params).forEach(key => {
      const replace = `%{${key}}`;
      const value = params[key];
      content = content.split(replace).join(value);
    });

    if (intend) {
      return content
        .replace(/\n$/, '')
        .split(nl)
        .join(`${nl}${intend}`);
    }

    return content;
  };
});

function capitalize(str) {
  return str[0].toUpperCase() + str.substr(1);
}

function getTitle(file) {
  const parts = file.split('-');
  return parts.map(m => capitalize(m)).join(' ');
}

function getComponentName(title) {
  return title.split(' ').join('');
}

function getTypeInfo(id, node) {
  for (const child of node.children) {
    if (child.id === id) {
      return child;
    } else if (child.children) {
      const info = getTypeInfo(id, child);

      if (info) {
        return info;
      }
    }
  }

  return undefined;
}

function getTypeIds(type) {
  if (type) {
    if (type.id) {
      return [type.id];
    } else if (type.types) {
      return type.types.map(getTypeIds).reduce((prev, curr) => [...prev, ...curr], []);
    } else if (type.elements) {
      return type.elements.map(getTypeIds).reduce((prev, curr) => [...prev, ...curr], []);
    }
  }

  return [];
}

function fillTypeRefInformation(typeNode, content, children) {
  const ids = getTypeIds(typeNode) || [];

  for (const id of ids) {
    const [available] = children.filter(m => m.id === id);

    if (!available) {
      const typeInfo = getTypeInfo(id, content);

      if (typeInfo) {
        switch (typeInfo.kind) {
          case 128: // Class
          case 256: // Interface
          case 65536: // TypeLiteral
          case 2097152: // ObjectLiteral
            fillInterfaceInformation(typeInfo, content, children);
            break;
          default:
            children.push(typeInfo);
            break;
        }
      }
    }
  }
}

function fillTypeSignatureInformation(signatures, content, children) {
  for (const signature of signatures) {
    fillTypeRefInformation(signature.type, content, children);

    for (const parameter of signature.parameters || []) {
      fillTypeRefInformation(parameter.type, content, children);
    }

    fillTypeRefInformation(signature.typeParameter, content, children);
  }
}

function fillInterfaceInformation(node, content, children) {
  children.push(node);
  fillTypeRefInformation(node.type, content, children);
  fillTypeSignatureInformation(node.signatures || [], content, children);
  fillTypeSignatureInformation(node.indexSignatures || [], content, children);

  if (node.children) {
    for (const child of node.children) {
      fillTypeRefInformation(child.type, content, children);
      fillTypeSignatureInformation(child.signatures || [], content, children);
    }
  }
}

function fillTypeInformation(node, content, children) {
  switch (node.kind) {
    case 0: //Root
    case 1: //ExternalModule
      if (node.children) {
        for (const child of node.children) {
          fillTypeInformation(child, content, children);
        }
      }
      break;
    case 4: // Enumeration
      if (node.comment && node.comment.shortText) {
        children.push(node);
      }
      break;
    case 32: // Variable
    case 4194304: // TypeAlias
      if (node.comment && node.comment.shortText) {
        children.push(node);
        fillTypeRefInformation(node.type, content, children);
      }
      break;
    case 64: // Function
      const singature = node.signatures && node.signatures[0];

      if (singature.comment && singature.comment.shortText) {
        children.push(node);
        fillTypeSignatureInformation(node.signatures, content, children);
      }
      break;
    case 128: // Class
    case 256: // Interface
    case 65536: // TypeLiteral
    case 2097152: // ObjectLiteral
      if (node.comment && node.comment.shortText) {
        fillInterfaceInformation(node, content, children);
      }
      break;
  }
}

function normalizeTypes(oldContent) {
  const children = [];

  for (const child of oldContent.children) {
    fillTypeInformation(child, oldContent, children);
  }

  const ids = children.map(m => m.id);

  for (let k = ids.length; k--; ) {
    const id = ids[k];

    if (ids.indexOf(id) !== k) {
      children.splice(k, 1);
    }
  }

  return {
    id: oldContent.id,
    name: oldContent.name,
    kind: oldContent.kind,
    flags: oldContent.flags,
    children,
  };
}

function generateMdSection({ title, link, comp }) {
  const id = title.replace(/\s/g, '-').toLowerCase();
  const relLink = relative(rootDocsFolder, link);
  return templates.MdSection(
    {
      id,
      title,
      comp,
      relRoot,
      relLink,
    },
    intend,
  );
}

function generateTiSection({ file }) {
  const name = file.substr(0, file.indexOf('.'));
  return templates.TiSection(
    {
      name,
      relRoot,
    },
    intend,
  );
}

function generateLoading({ componentName, file }) {
  return templates.MdPageLoad(
    {
      componentName,
      file,
    },
    intend,
  );
}

function generateRoute({ componentName, url }) {
  return templates.MdPageRoute(
    {
      componentName,
      url,
    },
    intend,
  );
}

function generateOverviewCard({ title, url, description }) {
  return templates.MdPageLink(
    {
      title,
      url,
      description,
    },
    intend,
  );
}

function generateSections(results, genSec) {
  return results.map(genSec).join(`${nl}${intend}`);
}

function replaceBody(content, body, start = startJsxMarker, end = endJsxMarker) {
  const startIndex = content.indexOf(start);
  const endIndex = content.indexOf(end, startIndex);
  const head = content.substring(0, startIndex + start.length);
  const rest = content.substring(endIndex);
  return head + nl + intend + body + nl + intend + rest;
}

function fillPage(content, links) {
  const loading = links.map(generateLoading).join(nl);
  const routes = links.map(generateRoute).join(nl);
  const body1 = replaceBody(content, loading, startPlainMarker, endPlainMarker);
  const body2 = replaceBody(body1, routes, startJsxMarker, endJsxMarker);
  return body2;
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
    const sections = files.map(file => {
      const p = resolve(dirPath, file);
      const oldContent = JSON.parse(readFileSync(p, 'utf8'));
      const newContent = normalizeTypes(oldContent);
      writeFileSync(p, JSON.stringify(newContent), 'utf8');
      return { file };
    });

    return generateSections(sections, generateTiSection);
  },
  pages(source) {
    const dirPath = resolve(rootDocsFolder, source.dir);
    const files = readdirSync(dirPath).filter(m => m !== 'README.md' && /\.md$/.test(m));
    const links = files.map(file => {
      const fileName = file.replace(/\.md$/, '');
      const title = getTitle(fileName);
      const componentName = getComponentName(title);
      const target = resolve(rootScriptsFolder, source.target, componentName + '.tsx');
      const relLink = relative(rootDocsFolder, resolve(dirPath, file));
      const content = templates.MdPageContent({
        id: componentName,
        title,
        relRoot,
        relLink,
      });
      writeFileSync(target, content, 'utf8');
      return {
        file,
        fileName,
        componentName,
        title,
        url: `${source.rootUrl}/${fileName}`,
        description: 'Foo bar',
      };
    });

    const page = resolve(rootScriptsFolder, source.target, 'Page.tsx');
    const pageOldContent = readFileSync(page, 'utf8');
    const pageNewContent = fillPage(pageOldContent, links);
    writeFileSync(page, pageNewContent, 'utf8');
    return generateSections(links, generateOverviewCard);
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
