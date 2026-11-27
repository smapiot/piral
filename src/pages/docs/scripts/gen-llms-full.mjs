// Generates docs/public/llms-full.txt — the full documentation concatenated as
// plain text for LLM ingestion. Runs as part of `npm run dev` / `npm run build`.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

import { getRoot } from './get-root.mjs';

const docs = getRoot();

// Curated reading order (paths relative to docs/, without the .md extension).
const ORDER = [
  'getting-started/introduction',
  'getting-started/quick-start',
  'getting-started/why-micro-frontends',
  'getting-started/why-piral',
  'getting-started/project-structure',
  'concepts/architecture',
  'concepts/app-shell',
  'concepts/pilets',
  'concepts/feed-service',
  'concepts/pilet-api',
  'concepts/dependency-sharing',
  'concepts/emulator',
  'concepts/extension-slots',
  'guides/building-app-shell',
  'guides/creating-pilet',
  'guides/routing',
  'guides/shared-state',
  'guides/multi-framework',
  'guides/authentication',
  'guides/testing',
  'guides/typescript',
  'guides/deployment',
  'guides/llms',
  'advanced/custom-feed',
  'advanced/performance',
  'advanced/module-federation',
  'advanced/pilet-portability',
  'advanced/monorepo',
  'advanced/ssr',
  'advanced/migration',
  'reference/cli',
  'reference/configuration',
  'reference/piral-packages',
  'api/hooks',
  'api/piral-plugin',
  'reference/plugins',
  'reference/creating-a-converter',
];

function clean(md) {
  let body = md.replace(/^---\n[\s\S]*?\n---\n/, ''); // frontmatter
  // Replace diagram figures with their caption (SVG markup is noise for an LLM).
  body = body.replace(/<figure>[\s\S]*?<\/figure>/g, (m) => {
    const cap = m.match(/<figcaption>([\s\S]*?)<\/figcaption>/);
    const text = cap ? cap[1].replace(/<[^>]+>/g, '').trim() : '';
    return text ? `_(Diagram: ${text})_` : '';
  });
  body = body.replace(/<div class="diagram-wrap"[\s\S]*?<\/div>/g, '');
  body = body.replace(/<svg[\s\S]*?<\/svg>/g, '');
  body = body.replace(/\n{3,}/g, '\n\n');
  return body.trim();
}

const parts = [
  '# Piral — full documentation',
  '',
  '> Plain-text concatenation of the Piral documentation for LLM ingestion.',
  '> Generated at build time. For a navigable index, see /llms.txt.',
];

let count = 0;
for (const rel of ORDER) {
  const file = join(docs, `${rel}.md`);
  if (!existsSync(file)) continue;
  parts.push('', '', '='.repeat(72), `Source: /${rel}`, '='.repeat(72), '', clean(readFileSync(file, 'utf8')));
  count++;
}

const text = parts.join('\n') + '\n';
writeFileSync(join(docs, 'public', 'llms-full.txt'), text, 'utf8');
console.log(`llms-full.txt: ${count} pages, ${(Buffer.byteLength(text) / 1024).toFixed(0)} KB`);
