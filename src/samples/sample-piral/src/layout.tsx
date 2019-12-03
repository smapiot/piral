import * as React from 'react';
import { useTranslate, ComponentsState, ErrorComponentsState } from 'piral';
import { SearchInput } from 'piral-search';
import { Layout, LanguagePicker } from './components';
import { getTileClass } from './utils';

export const errors: Partial<ErrorComponentsState> = {
  menu: () => <span />,
  extension: () => <div />,
  feed: ({ error }) => (
    <div className="pi-error">
      <img src={require('./images/error.svg')} alt="Error" />
      <div className="pi-title">Data Unavailable</div>
      <div className="pi-description">
        The demanded data has not been found. Please contact support to resolve this issue.
      </div>
      <div className="pi-details">{error}</div>
    </div>
  ),
  loading: () => (
    <div className="pi-center">
      <div className="pi-error">
        <img src={require('./images/error.svg')} alt="Error" />
        <div className="pi-title">Something Went Wrong</div>
        <div className="pi-description">
          An error occured during the loading process. Try refreshing or come back later.
        </div>
      </div>
    </div>
  ),
  not_found: () => (
    <div className="pi-error">
      <img src={require('./images/not-found.svg')} alt="Not Found" />
      <div className="pi-title">Page Not Found</div>
      <div className="pi-description">
        The provided URL does not map to a page. Please contact support to resolve this issue.
      </div>
    </div>
  ),
  page: () => (
    <div className="pi-error">
      <img src={require('./images/error.svg')} alt="Error" />
      <div className="pi-title">Page Crashed</div>
      <div className="pi-description">
        Sorry for the inconvenience. We try to resolve the issue as soon as possible.
      </div>
    </div>
  ),
  modal: ({ onClose }) => (
    <div className="pi-error">
      <img src={require('./images/error.svg')} alt="Error" />
      <div className="pi-title">Dialog Crashed</div>
      <div className="pi-description">
        <p>Sorry for the inconvenience. We try to resolve the issue as soon as possible.</p>
        <button className="btn btn-primary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  ),
  tile: () => (
    <div className="pi-error">
      <div className="pi-title">Tile Crashed</div>
      <div className="pi-description">Sorry for the inconvenience.</div>
    </div>
  ),
  unknown: () => (
    <div className="pi-error">
      <img src={require('./images/error.svg')} alt="Error" />
      <div className="pi-title">Unknown Error</div>
      <div className="pi-description">An unknown error occured.</div>
    </div>
  ),
};

export const layout: Partial<ComponentsState> = {
  Layout,
  LanguagesPicker: LanguagePicker,
  LoadingIndicator: () => (
    <div className="pi-center">
      <div className="pi-spinner">Loading</div>
    </div>
  ),
  DashboardContainer: ({ children }) => {
    const translate = useTranslate();
    return (
      <div className="pi-content">
        <h1>{translate('sample')}</h1>
        <div className="pi-dashboard">{children}</div>
      </div>
    );
  },
  DashboardTile: ({ children, rows, columns }) => <div className={getTileClass(columns, rows)}>{children}</div>,
  MenuContainer: ({ children }) => <div className="pi-menu">{children}</div>,
  MenuItem: ({ children }) => <div className="pi-item">{children}</div>,
  SearchContainer: ({ loading, children }) => (
    <div className="pi-search">
      <SearchInput />
      <div className="pi-details">
        {children}
        {loading && (
          <div className="pi-center">
            <div className="pi-spinner" />
          </div>
        )}
      </div>
    </div>
  ),
  SearchInput: ({ setValue, value }) => {
    const translate = useTranslate();
    return (
      <input
        type="search"
        required
        placeholder={translate('search')}
        onChange={e => setValue(e.target.value)}
        value={value}
      />
    );
  },
  SearchResult: ({ children }) => <div className="pi-item">{children}</div>,
  NotificationsHost: ({ children }) => <div className="pi-notifications">{children}</div>,
  NotificationsToast: ({ options, onClose, children }) => (
    <div className={`pi-item ${options.type}`}>
      <div className="pi-details">
        {options.title && <div className="pi-title">{options.title}</div>}
        <div className="pi-description">{children}</div>
      </div>
      <div className="pi-close" onClick={onClose} />
    </div>
  ),
  ModalsHost: ({ children, open }) => {
    React.useEffect(() => {
      const body = document.body;

      if (open) {
        body.style.top = `-${window.scrollY}px`;
        body.classList.add('pi-modal-open');
      } else {
        const offset = -parseInt(body.style.top || '0', 10);
        body.classList.remove('pi-modal-open');
        body.style.top = '';
        window.scrollTo(0, offset);
      }

      return () => {};
    }, [open]);
    return <div className="pi-modal">{children}</div>;
  },
  ModalsDialog: ({ children }) => <div className="pi-modal-dialog">{children}</div>,
};
