import * as React from 'react';
import { ArbiterModule } from 'react-arbiter';
import { PiralApi } from 'piral-core';

/**
 * Shows a custom search registration.
 */
export const SearchPilet: ArbiterModule<PiralApi> = {
  content: '',
  dependencies: {},
  name: 'Search Module',
  version: '1.0.0',
  hash: '428',
  setup(piral) {
    const htmlResult = document.createElement('div');
    htmlResult.innerHTML = '<span style="color: red;">I AM HTML</span>';

    piral.registerSearchProvider(
      'example1',
      q =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve([
                <b>Sample result 1 for {q}</b>,
                <i>Sample result 2 for {q}</i>,
                <span>Third result</span>,
                <div>4th result</div>,
                htmlResult,
              ]),
            1000,
          ),
        ),
    );

    piral.registerSearchProvider(
      'example2',
      q => new Promise(resolve => setTimeout(() => resolve([<div>Another result ({q})</div>]), 3500)),
    );
  },
};
