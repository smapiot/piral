import * as React from 'react';
import { Link } from 'react-router-dom';
import { ArbiterModule } from 'react-arbiter';
import { PageComponentProps, PortalApi, TileComponentProps, MenuComponentProps } from 'piral-core';

/**
 * Shows the usage of another module, here with a
 * feed connector.
 */
export const Module2: ArbiterModule<PortalApi<{}>> = {
  content: '',
  dependencies: {},
  name: 'Sample Module',
  version: '1.0.0',
  hash: '2',
  setup(portal) {
    console.log(portal);

    const connect = portal.createConnector<Array<string>, string>({
      initialize() {
        return new Promise((resolve, reject) => setTimeout(() => resolve(['one', 'two', 'three']), 2000));
      },
      connect(cb) {
        let i = 0;
        const id = setInterval(() => {
          cb(`${i++}`);
        }, 1000);
        return () => clearInterval(id);
      },
      update(data, item) {
        return [...data, item];
      },
    });

    portal.registerTile(
      'example',
      class extends React.Component<TileComponentProps<PortalApi<{}>>> {
        render() {
          return <div className="tile">Rendered tile from another module.</div>;
        }
      },
    );

    portal.registerMenu(
      'example',
      class extends React.Component<MenuComponentProps<PortalApi<{}>>> {
        render() {
          return <Link to="/example3">Example 3</Link>;
        }
      },
      { type: 'general' },
    );

    portal.registerPage(
      '/example3',
      connect(
        class extends React.Component<PageComponentProps<PortalApi<{}>> & { data: Array<string> }> {
          render() {
            return (
              <div>
                <b>This is the example page from module 2 (sample module)!</b>
                <p>Loaded the following data:</p>
                <ul>
                  {this.props.data.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          }
        },
      ),
    );
  },
};
