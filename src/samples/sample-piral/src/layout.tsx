import * as React from 'react';
import { buildLayout, useTranslate } from 'piral';
import { Layout } from './components';
import { getTileClass } from './utils';

export const layout = buildLayout()
  .withLayout(Layout)
  .withLoader(() => (
    <div className="pi-center">
      <div className="pi-spinner">Loading</div>
    </div>
  ))
  .createDashboard(dashboard =>
    dashboard
      .container(({ children }) => {
        const translate = useTranslate();
        return (
          <div className="pi-content">
            <h1>{translate('sample')}</h1>
            <div className="pi-dashboard">{children}</div>
          </div>
        );
      })
      .tile(({ children, rows, columns }) => <div className={getTileClass(columns, rows)}>{children}</div>),
  )
  .createError(error =>
    error
      .feed(({ error }) => (
        <div className="pi-error">
          <img src={require('./images/error.svg')} alt="Error" />
          <div className="pi-title">Data Unavailable</div>
          <div className="pi-description">
            The demanded data has not been found. Please contact support to resolve this issue.
          </div>
          <div className="pi-details">{error}</div>
        </div>
      ))
      .form(() => (
        <div className="pi-error">
          <img src={require('./images/error.svg')} alt="Error" />
          <div className="pi-title">Submission Failed</div>
          <div className="pi-description">The form could not be submitted.</div>
        </div>
      ))
      .loading(() => (
        <div className="pi-error">
          <img src={require('./images/error.svg')} alt="Error" />
          <div className="pi-title">Something Went Wrong</div>
          <div className="pi-description">
            An error occured during the loading process. Try refreshing or come back later.
          </div>
        </div>
      ))
      .notFound(() => (
        <div className="pi-error">
          <img src={require('./images/not-found.svg')} alt="Not Found" />
          <div className="pi-title">Page Not Found</div>
          <div className="pi-description">
            The provided URL does not map to a page. Please contact support to resolve this issue.
          </div>
        </div>
      ))
      .page(() => (
        <div className="pi-error">
          <img src={require('./images/error.svg')} alt="Error" />
          <div className="pi-title">Page Crashed</div>
          <div className="pi-description">
            Sorry for the inconvenience. We try to resolve the issue as soon as possible.
          </div>
        </div>
      ))
      .unknown(() => (
        <div className="pi-error">
          <img src={require('./images/error.svg')} alt="Error" />
          <div className="pi-title">Unknown Error</div>
          <div className="pi-description">An unknown error occured.</div>
        </div>
      )),
  )
  .createMenu(menu =>
    menu
      .container(({ children }) => <div className="pi-menu">{children}</div>)
      .item(({ children }) => <div className="pi-item">{children}</div>),
  )
  .createSearch(search =>
    search
      .container(({ input, loading, children }) => (
        <div className="pi-search">
          {input}
          <div className="pi-details">
            {children}
            {loading && (
              <div className="pi-center">
                <div className="pi-spinner" />
              </div>
            )}
          </div>
        </div>
      ))
      .input(({ setValue, value }) => {
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
      })
      .result(({ children }) => <div className="pi-item">{children}</div>),
  )
  .createNotifications(notifications =>
    notifications
      .container(({ children }) => <div className="pi-notifications">{children}</div>)
      .item(({ options, close, content }) => (
        <div className={`pi-item ${options.type}`}>
          <div className="pi-details">
            {options.title && <div className="pi-title">{options.title}</div>}
            <div className="pi-description">{content}</div>
          </div>
          <div className="pi-close" onClick={close} />
        </div>
      )),
  )
  .createModals(modals =>
    modals
      .container(({ children, open }) => {
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
      })
      .dialog(({ children }) => <div className="pi-modal-dialog">{children}</div>),
  );
