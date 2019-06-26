import * as React from 'react';

export const Status: React.FC = () => (
  <span className="badges">
    <a href="https://www.npmjs.com/package/piral">
      <img src="https://img.shields.io/npm/v/piral.svg?style=flat" alt="npm version" />
    </a>
    <a href="https://github.com/smapiot/piral/releases">
      <img src="https://img.shields.io/github/tag/smapiot/piral.svg" alt="GitHub tag" />
    </a>
  </span>
);
