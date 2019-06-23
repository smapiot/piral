const { resolve, dirname, relative } = require('path');
const { readFileSync, writeFileSync, readdirSync } = require('fs');

const nl = '\n';
const intend = '    ';
const autoGenMessage = 'auto-generated';
const startMarker = `{/* start:${autoGenMessage} */}`;
const endMarker = `{/* end:${autoGenMessage} */}`;
const refFormat = /\- \[(.*)\]\((.*)\)/g;

const rootDocsFolder = resolve(__dirname, '..', 'docs');
const rootScriptsFolder = resolve(__dirname, '..', 'src', 'pages', 'docs', 'src', 'scripts');
const relRoot = '../../../../../../docs';

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
        children.push(typeInfo);
      }
    }
  }
}

function fillTypeSignatureInformation(signatures, content, children) {
  for (const signature of signatures) {
    fillTypeRefInformation(signature.type, content, children);

    for (const parameter of (signature.parameters || [])) {
      fillTypeRefInformation(parameter.type, content, children);
    }

    fillTypeRefInformation(signature.typeParameter, content, children);
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
        children.push(node);
        fillTypeSignatureInformation(node, content, children);
        fillTypeSignatureInformation(node.signatures || [], content, children);
        fillTypeSignatureInformation(node.indexSignatures || [], content, children);

        if (node.children) {
          for (const child of node.children) {
            fillTypeRefInformation(child.type, content, children);
            fillTypeSignatureInformation(child.signatures || [], content, children);
          }
        }
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
  return `<Section id="section-${id}" title="${title}">
  <${comp}>{require('${relRoot}/${relLink}')}</${comp}>
  <EditSection link="${relLink}" />
</Section>`.split(nl).join(`${nl}${intend}`);
}

function generateTiSection({ file }) {
  const name = file.substr(0, file.indexOf('.'));
  return `<Section id="section-${name}" title="${name}">
  <Ti>{require('${relRoot}/types/${name}.json')}</Ti>
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
    const sections = files.map(file => {
      const p = resolve(rootDocsFolder, source.dir, file)
      const oldContent = JSON.parse(readFileSync(p, 'utf8'));
      const newContent = normalizeTypes(oldContent);
      writeFileSync(p, JSON.stringify(newContent), 'utf8');
      return { file };
    });

    return generateSections(sections, generateTiSection);
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
