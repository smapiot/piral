const { join, resolve } = require('path');
const { writeFileSync } = require('fs');
const { createProgram, isExportAssignment, getCombinedModifierFlags, ModifierFlags, SyntaxKind, forEachChild } = require('typescript');

const projectRoot = resolve(__dirname, '..');
const rootFolder = resolve(projectRoot, 'docs', 'messages');
const messagesFile = resolve(projectRoot, 'src', 'packages', 'piral-cli', 'src', 'messages.ts');

function isNodeExported(node) {
  return (
    isExportAssignment(node) ||
    (getCombinedModifierFlags(node) & ModifierFlags.Export) !== 0 ||
    (!!node.parent && node.parent.kind === SyntaxKind.SourceFile)
  );
}

function getCodes() {
  const codes = [];
  const program = createProgram([messagesFile], {});
  const checker = program.getTypeChecker();
  const tp = program.getSourceFile(messagesFile);

  forEachChild(tp, node => {
    if (isNodeExported(node) && node.kind === SyntaxKind.FunctionDeclaration) {
      const type = checker.getTypeAtLocation(node);
      const docs = type.symbol.getJsDocTags();
      codes.push({
        id: type.symbol.name.split('_').pop(),
        docs: docs.reduce((prev, curr) => {
          prev[curr.name] = curr.text;
          return prev;
        }, {}),
      });
    }
  });

  return codes;
}

function generateMessageDocs() {
  const codes = getCodes();

  for (const code of codes) {
    const target = join(rootFolder, `${code.id}.md`);
    const content = `# ${code.docs.kind}: ${code.id}

${code.docs.summary}

## Description

${code.docs.abstract}

## Example

${code.docs.example}

## Further Reading

${code.docs.see}
`;
    writeFileSync(target, content, 'utf8');
  }
}

if (require.main === module) {
  generateMessageDocs();
  console.log('CLI messages documentation generated!');
} else {
  module.exports = generateMessageDocs;
}
