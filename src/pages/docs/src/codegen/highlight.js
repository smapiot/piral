const hljs = require('highlight.js');

function hljsDefineSvelte(hljs) {
  return {
    subLanguage: 'xml',
    contains: [
      hljs.COMMENT('<!--', '-->', {
        relevance: 10,
      }),
      {
        begin: /^(\s*)(<script(\s*context="module")?>)/gm,
        end: /^(\s*)(<\/script>)/gm,
        subLanguage: 'javascript',
        excludeBegin: true,
        excludeEnd: true,
        contains: [
          {
            begin: /^(\s*)(\$:)/gm,
            end: /(\s*)/gm,
            className: 'keyword',
          },
        ],
      },
      {
        begin: /^(\s*)(<style.*>)/gm,
        end: /^(\s*)(<\/style>)/gm,
        subLanguage: 'css',
        excludeBegin: true,
        excludeEnd: true,
      },
      {
        begin: /\{/gm,
        end: /\}/gm,
        subLanguage: 'javascript',
        contains: [
          {
            begin: /[\{]/,
            end: /[\}]/,
            skip: true,
          },
          {
            begin: /([#:\/@])(if|else|each|await|then|catch|debug|html)/gm,
            className: 'keyword',
            relevance: 10,
          },
        ],
      },
    ],
  };
}

function hljsDefineGraphQl(e) {
  return {
    aliases: ['gql'],
    k: {
      keyword: 'query mutation subscription|10 type interface union scalar fragment|10 enum on ...',
      literal: 'true false null',
    },
    c: [
      e.HCM,
      e.QSM,
      e.NM,
      { cN: 'type', b: '[^\\w][A-Z][a-z]', e: '\\W', eE: !0 },
      { cN: 'literal', b: '[^\\w][A-Z][A-Z]', e: '\\W', eE: !0 },
      { cN: 'variable', b: '\\$', e: '\\W', eE: !0 },
      { cN: 'keyword', b: '[.]{2}', e: '\\.' },
      { cN: 'meta', b: '@', e: '\\W', eE: !0 },
    ],
    i: /([;<']|BEGIN)/,
  };
}

hljs.registerLanguage('graphql', hljsDefineGraphQl);
hljs.registerLanguage('svelte', hljsDefineSvelte);
