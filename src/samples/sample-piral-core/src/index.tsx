import * as React from 'react';
import { render } from 'react-dom';
import { Link, RouteComponentProps } from 'react-router-dom';
import {
  createInstance,
  useGlobalState,
  LoadingIndicatorProps,
  useAction,
  Piral,
  SetComponent,
  SetRoute,
} from 'piral-core';
import { createMenuApi } from 'piral-menu';
import { createFeedsApi } from 'piral-feeds';
import { createFormsApi } from 'piral-forms';
import { createNotificationsApi } from 'piral-notifications';
import { createDashboardApi, Dashboard } from 'piral-dashboard';
import { createContainersApi } from 'piral-containers';
import { createSearchApi, useSearch } from 'piral-search';
import { availablePilets } from './pilets';

customElements.define(
  'pi-spinner',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.classList.add('spinner', 'circles');
    }
  },
);

const Loader: React.FC<LoadingIndicatorProps> = () => (
  <div className="app-center">
    <pi-spinner>Loading ...</pi-spinner>
  </div>
);

const Sitemap: React.FC<RouteComponentProps> = () => {
  const pages = useGlobalState(s => s.registry.pages);

  return (
    <ul>
      <li>
        <Link to="/">Go to /</Link>
      </li>
      {Object.keys(pages)
        .map(url => url.replace(':id', `${~~(Math.random() * 1000)}`))
        .map(url => (
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

const Menu: React.FC = () => {
  const menuItems = useGlobalState(s => s.registry.menuItems);

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

const SearchResults: React.FC = () => {
  const { loading, items } = useGlobalState(m => m.search.results);
  return (
    <div className="search-results">
      {items.map((item, i) => (
        <div className="search-results-item" key={i}>
          {item}
        </div>
      ))}
      {loading && (
        <div className="search-results-loading">
          <Loader />
        </div>
      )}
    </div>
  );
};

const SearchForm: React.FC = () => {
  const [value, setValue] = useSearch();
  const search = useAction('triggerSearch');

  return (
    <form
      className="search"
      onSubmit={ev => {
        search(value, true);
        return ev.preventDefault();
      }}>
      <input type="search" placeholder="Search" onChange={e => setValue(e.target.value)} value={value} />
      <SearchResults />
    </form>
  );
};

const Notifications: React.FC = () => {
  const notifications = useGlobalState(s => s.notifications);

  return (
    <div className="app-notifications">
      {notifications.map(({ id, close, options, component: Component }) => (
        <div className={`notification ${options.type || 'info'}`} key={id}>
          <div className="notification-content">
            {options.title && <div className="notification-title">{options.title}</div>}
            <div className="notification-message">
              <Component onClose={close} options={options} />
            </div>
          </div>
          <div className="notification-close" onClick={close}>
            <img src={require('./close.svg')} />
          </div>
        </div>
      ))}
    </div>
  );
};

const Layout: React.FC = ({ children }) => {
  const layout = useGlobalState(s => s.app.layout);

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Sample Portal ({layout})</h1>
        <SearchForm />
        <Menu />
      </div>
      <div className="app-content">{children}</div>
      <div className="app-footer">
        For more information or the source code check out our{' '}
        <a href="https://github.com/smapiot/piral">GitHub repository</a>.
      </div>
      <Notifications />
    </div>
  );
};

const instance = createInstance({
  availablePilets,
  extendApi: [
    createMenuApi(),
    createNotificationsApi(),
    createContainersApi(),
    createDashboardApi(),
    createFeedsApi(),
    createFormsApi(),
    createSearchApi(),
  ],
  requestPilets() {
    return new Promise(resolve => setTimeout(() => resolve([]), 1000));
  },
});

const app = (
  <Piral instance={instance}>
    <SetComponent name="LoadingIndicator" component={Loader} />
    <SetComponent name="Layout" component={Layout} />
    <SetRoute path="/" component={Dashboard} />
    <SetRoute path="/sitemap" component={Sitemap} />
  </Piral>
);
render(app, document.querySelector('#app'));
