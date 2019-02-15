import * as React from 'react';
import { Link } from 'react-router-dom';
import { ArbiterModule } from 'react-arbiter';
import {
  PageComponentProps,
  PortalApi,
  ExtensionComponentProps,
  TileComponentProps,
  ErrorInfoProps,
  MenuComponentProps,
} from 'piral-core';

/**
 * Shows the general usage of the `setup` function together
 * with some tile and page registrations.
 * Also registeres some custom error page handlers. For details
 * on this, see DashboardModule.
 */
export const Module1: ArbiterModule<PortalApi<{}>> = {
  content: '',
  dependencies: {},
  name: 'Example Module',
  version: '1.0.0',
  hash: '1',
  setup(portal) {
    console.log(portal);

    portal.registerTile('example-general', (element, props) => {
      element.outerHTML = `
        <div class="tile">
          General rendering for a ${props.columns}x${props.rows} tile.
        </div>
      `;
    });

    portal.registerTile(
      'example-react',
      class extends React.Component<TileComponentProps<PortalApi<{}>>> {
        render() {
          return <div className="tile">Rendered a tile from React.</div>;
        }
      },
    );

    portal.registerMenu(
      'example',
      class extends React.Component<MenuComponentProps<PortalApi<{}>>> {
        render() {
          return <Link to="/example1">Example 1</Link>;
        }
      },
      { type: 'general' },
    );

    portal.registerPage(
      '/example1',
      class extends React.Component<PageComponentProps<PortalApi<{}>>> {
        render() {
          return (
            <div>
              <p>
                This is the first <b>example</b> page
              </p>
              <p>Click for a notification.</p>
              <ul>
                <li>
                  <button onClick={() => portal.showNotification('Hello there!')}>Notify me! (Default)</button>
                </li>
                <li>
                  <button onClick={() => portal.showNotification('Hello there!', { type: 'error' })}>
                    Notify me! (Error)
                  </button>
                </li>
                <li>
                  <button onClick={() => portal.showNotification('Hello there!', { title: 'Some title' })}>
                    Notify me! (With Title)
                  </button>
                </li>
                <li>
                  <button onClick={() => portal.showNotification('Hello there!', { autoClose: 1000, type: 'success' })}>
                    Notify me! (1s)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      portal.showNotification(
                        <span>
                          Hello there; this is <b>some longer text</b>!
                        </span>,
                        { autoClose: 1500, type: 'warning' },
                      )
                    }>
                    Notify me! (longer, formatted text 1.5s)
                  </button>
                </li>
              </ul>
            </div>
          );
        }
      },
    );

    portal.registerPage(
      '/example2',
      class extends React.Component<PageComponentProps<PortalApi<{}>>> {
        render() {
          return (
            <div>
              <p>
                This is the second <b>example</b> page
              </p>
              <p>
                IF YOU ARE IN AN ADVENTUROUS MOOD TRY{' '}
                <a
                  onClick={e => {
                    portal.unregisterPage('/example2');
                    e.preventDefault();
                  }}
                  href="#">
                  THIS LINK
                </a>
                .
              </p>
            </div>
          );
        }
      },
    );

    portal.registerExtension(
      'error',
      class extends React.Component<ExtensionComponentProps<PortalApi<{}>, ErrorInfoProps>> {
        render() {
          return <div>Custom Error page</div>;
        }
      },
    );

    portal.registerExtension(
      'error',
      class extends React.Component<ExtensionComponentProps<PortalApi<{}>, ErrorInfoProps>> {
        render() {
          if (this.props.params.type === 'not_found') {
            return <div>The page was not found!!!</div>;
          }
          return false;
        }
      },
    );
  },
};
