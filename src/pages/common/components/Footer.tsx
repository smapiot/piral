import * as React from 'react';
import { FooterMenu } from './FooterMenu';
import '../styles/_footer.scss';

const year = new Date().getFullYear();

export const Footer: React.FC = () => (
  <footer>
    <div className="container footer">
      <div className="row footer-columns">
        <div>
          <a href="https://smapiot.com" target="_blank" className="flex">
            <img src={require('../assets/smapiot_logos_white.svg')} className="logo" alt="smapiot Logo" />
          </a>
        </div>
        <div>
          <FooterMenu title="Piral Universe">
            <li>
              <a href="https://www.piral.io" target="_blank">
                Homepage
              </a>
            </li>
            <li>
              <a href="https://docs.piral.io" target="_blank">
                Documentation
              </a>
            </li>
            <li>
              <a href="https://discord.gg/kKJ2FZmK8t" target="_blank">
                Community Chat
              </a>
            </li>
            <li>
              <a href="https://www.piral.cloud" target="_blank">
                Cloud Services
              </a>
            </li>
            <li>
              <a href="https://demo-full.piral.io" target="_blank">
                Sample Application
              </a>
            </li>
            <li>
              <a href="https://www.piral.io/oss-friends" target="_blank">
                Open-Source Friends
              </a>
            </li>
            <li>
              <a href="https://status.piral.io" target="_blank">
                Status
              </a>
            </li>
            <li>
              <a href="https://www.smapiot.com/en/legal-notice/" target="_blank">
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
            <li>
              <a href="https://github.com/piral-samples" target="_blank">
                Sample Codes
              </a>
            </li>
          </FooterMenu>
        </div>
      </div>
      <p className="copy-rights h3">
        Copyright &copy; {year} smapiot GmbH.
        <br />
        Made with <i className="fa fa-heart" aria-hidden="true" /> in Munich.
      </p>
    </div>
  </footer>
);
