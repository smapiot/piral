import * as React from 'react';

export const Status: React.SFC = () => (
  <div className="badges container text-center ">
    <a href="https://www.npmjs.com/package/piral">
      <img src="https://img.shields.io/npm/v/piral.svg?style=flat" alt="npm version" />
    </a>
    <a href="https://github.com/smapiot/piral/releases">
      <img src="https://img.shields.io/github/tag/smapiot/piral.svg" alt="GitHub Tag" />
    </a>
  </div>
);
