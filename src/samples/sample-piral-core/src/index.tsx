import 'core-js/es7/reflect';
import 'zone.js/dist/zone';

import * as React from 'react';
import { render } from 'react-dom';
import { Link, RouteComponentProps } from 'react-router-dom';
import { createInstance, useGlobalState, LoaderProps, useSearch, useAction } from 'piral-core';
import { createNgApi } from 'piral-ng';
import { createVueApi } from 'piral-vue';
import { availablePilets } from './pilets';
import { SampleApi } from './types';

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

const Loader: React.SFC<LoaderProps> = () => (
  <div className="app-center">
    <pi-spinner>Loading ...</pi-spinner>
  </div>
);

const Sitemap: React.SFC<RouteComponentProps> = () => {
  const pages = useGlobalState(s => s.components.pages);

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

const SearchResults: React.SFC = () => {
  const { loading, items } = useGlobalState(m => ({
    loading: m.search.loading,
    items: m.search.results,
  }));
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

const SearchForm: React.SFC = () => {
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

const Layout: React.SFC = ({ children }) => {
  const layout = useGlobalState(s => s.app.layout.current);

  return (
    <div className="app-container">
      <Notifications />
      <div className="app-header">
        <h1>Sample Portal ({layout})</h1>
        <SearchForm />
        <Menu />
      </div>
      <div className="app-content">{children}</div>
      <div className="app-footer">For more information or the source code check out our GitHub repository.</div>
    </div>
  );
};

const Portal = createInstance<SampleApi>({
  availablePilets,
  extendApi(api) {
    return {
      ...createVueApi(api),
      ...createNgApi(api),
      ...api,
    } as any;
  },
  requestPilets() {
    // return fetch('http://localhost:9000/api/pilet')
    //   .then(res => res.json())
    //   .then(res => res.items);
    return new Promise(resolve => setTimeout(() => resolve([]), 1000));
  },
  Loader,
  routes: {
    '/sitemap': Sitemap,
  },
});

const App: React.SFC = () => <Portal>{content => <Layout>{content}</Layout>}</Portal>;

render(<App />, document.querySelector('#app'));
