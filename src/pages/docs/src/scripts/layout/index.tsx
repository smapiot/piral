import * as React from 'react';
import { Link, NavLink, Route } from 'react-router-dom';
import { Loader, FooterMenu, ScrollToTop } from '../components';

const updated = process.env.BUILD_TIME;
const version = process.env.BUILD_PCKG_VERSION;

export const Layout: React.FC = ({ children }) => (
  <>
    <Route component={ScrollToTop} />
    <header>
      <div className="container header">
        <div className="logo">
          <Link to="/">
            <img src={require('../../../../../../docs/assets/logo-simple.png')} alt="Piral Logo" />
          </Link>
          <span className="brand-name">Piral</span>
          <span className="brand-suffix">Docs</span>
        </div>
        <ul>
          <li>
            <NavLink to="/tutorials">
              Guideline
            </NavLink>
          </li>
          <li>
            <NavLink to="/reference">
              Reference
            </NavLink>
          </li>
          <li>
            <NavLink to="/samples">
              Samples
            </NavLink>
          </li>
          <li>
            <NavLink to="/faq">
              FAQ
            </NavLink>
          </li>
          <li>
            <a href="#" onClick={e => e.preventDefault()}>
              <i className="fas fa-search" />
            </a>
          </li>
        </ul>
      </div>
    </header>
    <div className="container version-info">
      {version && (
        <>
          <i className="fas fa-code-branch" /> v{version}{' '}
        </>
      )}
      {updated && (
        <>
          <i className="far fa-clock" /> Last updated: {updated}
        </>
      )}
    </div>
    <div className="content">
      <React.Suspense fallback={<Loader />}>{children}</React.Suspense>
    </div>
    <footer>
      <div className="container footer">
        <div className="row footer-columns">
          <div>
            <a href="https://smapiot.com" target="_blank">
              <img src={require('../../assets/smapiot_logos_white.svg')} className="logo" alt="smapiot Logo" />
            </a>
          </div>
          <div>
            <FooterMenu title="Piral Universe">
              <li>
                <a href="https://piral.io" target="_blank">
                  Homepage
                </a>
              </li>
              <li>
                <a href="https://gitter.im/piral-io/community" target="_blank">
                  Community Chat
                </a>
              </li>
              <li>
                <a href="https://feed.piral.io" target="_blank">
                  Cloud Services
                </a>
              </li>
              <li>
                <a href="https://demo-full.piral.io" target="_blank">
                  Sample Application
                </a>
              </li>
              <li>
                <a href="https://smapiot.com/legal/imprint/" target="_blank">
                  Imprint
                </a>
              </li>
            </FooterMenu>
          </div>
          <div>
            <FooterMenu title="Packages">
              <li>
                <a href="https://www.npmjs.com/package/piral" target="_blank">
                  Piral
                </a>
              </li>
              <li>
                <a href="https://www.npmjs.com/package/piral-cli" target="_blank">
                  Piral CLI
                </a>
              </li>
              <li>
                <a href="https://www.npmjs.com/search?q=keywords:piral" target="_blank">
                  All Packages
                </a>
              </li>
            </FooterMenu>
            <FooterMenu title="Source Code">
              <li>
                <a href="https://github.com/smapiot/piral" target="_blank">
                  Repository
                </a>
              </li>
              <li>
                <a href="https://github.com/smapiot/piral/issues" target="_blank">
                  Issue Tracker
                </a>
              </li>
            </FooterMenu>
          </div>
        </div>
        <p className="copy-rights h3">
          Copyright &copy; 2019 smapiot GmbH.
          <br />
          Made with <i className="fa fa-heart" aria-hidden="true" /> in Munich.
        </p>
      </div>
    </footer>
  </>
);
