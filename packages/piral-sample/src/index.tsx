import * as React from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router-dom';
import { createInstance, useGlobalState, LoaderProps } from 'piral-core';
import { modules } from './modules';

const Sitemap: React.SFC = () => {
  const pages = useGlobalState(s => s.components.pages);

  return (
    <ul>
      <li>
        <Link to="/">Go to /</Link>
      </li>
      {Object.keys(pages).map(url => (
        <li key={url}>
          <Link to={url}>Go to {url}</Link>
        </li>
      ))}
      <li>
        <Link to="/sitemap">Go to /sitemap</Link>
      </li>
      <li>
        <Link to="/not-found">Go to /not-found</Link>
      </li>
    </ul>
  );
};

const Menu: React.SFC = () => {
  const menuItems = useGlobalState(s => s.components.menuItems);

  return (
    <ul className="app-nav">
      <li>
        <Link to="/">Home</Link>
      </li>
      {Object.keys(menuItems).map(name => {
        const item = menuItems[name];

        if (item.settings.type === 'general') {
          const Component = item.component;
          return (
            <li key={name}>
              <Component />
            </li>
          );
        }

        return undefined;
      })}
      <li>
        <Link to="/sitemap">Sitemap</Link>
      </li>
    </ul>
  );
};

const Notifications: React.SFC = () => {
  const notifications = useGlobalState(s => s.app.notifications);

  return (
    <div className="app-notifications">
      {notifications.map(n => (
        <div className={`notification ${n.options.type || 'info'}`} key={n.id}>
          <div className="notification-content">
            {n.options.title && <div className="notification-title">{n.options.title}</div>}
            <div className="notification-message">{n.content}</div>
          </div>
          <div className="notification-close" onClick={n.close}>
            <img src={require('./close.svg')} />
          </div>
        </div>
      ))}
    </div>
  );
};

const Loader: React.SFC<LoaderProps> = () => (
  <div className="app-center">
    <div className="spinner circles">Loading ...</div>
  </div>
);

const Layout: React.SFC = ({ children }) => {
  const layout = useGlobalState(s => s.app.layout.current);

  return (
    <div className="app-container">
      <Notifications />
      <div className="app-header">
        <h1>Sample Portal ({layout})</h1>
        <Menu />
      </div>
      <div className="app-content">{children}</div>
      <div className="app-footer">For more information or the source code check out our GitHub repository.</div>
    </div>
  );
};

const Portal = createInstance({
  availableModules: modules,
  requestModules() {
    return new Promise((resolve, reject) => setTimeout(() => resolve([]), 1000));
  },
  Loader,
  routes: {
    '/sitemap': Sitemap,
  },
});

const App: React.SFC = () => <Portal>{content => <Layout>{content}</Layout>}</Portal>;

render(<App />, document.querySelector('#app'));
