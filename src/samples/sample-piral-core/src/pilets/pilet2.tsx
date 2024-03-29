import * as React from 'react';
import { Link } from 'react-router-dom';
import { Pilet, PiletApi } from 'piral-core';

/**
 * Shows the usage of another module, here with a
 * feed connector.
 */
export const Pilet2: Pilet = {
  name: 'Sample Module',
  version: '1.0.0',
  spec: 'v2',
  dependencies: {},
  config: {},
  basePath: '/pilets',
  link: '/pilets/connector',
  setup(piral: PiletApi) {
    console.log(piral);

    const connect = piral.createConnector({
      initialize() {
        return new Promise<Array<string>>((resolve) => setTimeout(() => resolve(['one', 'two', 'three']), 2000));
      },
      connect(cb) {
        let i = 0;
        const id = setInterval(() => {
          cb(`${i++}`);
        }, 1000);
        return () => clearInterval(id);
      },
      update(data: Array<string>, item: string) {
        return [...data, item];
      },
    });

    piral.registerTile(() => <div className="tile">Rendered tile from another module.</div>);

    piral.registerMenu(() => <Link to="/example3">Example 3</Link>, { type: 'general' });

    piral.registerPage(
      '/example3',
      connect(({ data }) => (
        <div>
          <b>This is the example page from module 2 (sample module)!</b>
          <p>Loaded the following data:</p>
          <ul>
            {data.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )),
    );
  },
};
