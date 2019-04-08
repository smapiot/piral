import * as React from 'react';

interface IconLinkProps {
  href: string;
  logo: string;
}

const IconLink: React.SFC<IconLinkProps> = ({ href, logo }) => (
  <a href={href} title={href} className="d-inline-block text-center ml-2">
    <i className={logo} aria-hidden="true" />
  </a>
);

export const Footer: React.SFC = () => (
  <div className="jumbotron jumbotron-fluid copyright">
    <div className="container">
      <div className="row justify-content-between">
        <div className="col-md-6 text-white align-self-center text-center text-md-left my-2">
          Copyright &copy; 2019 smapiot GmbH.
          <br />
          Made with <i className="fa fa-heart" aria-hidden="true" /> in Munich.
          <br />
          <a href="https://www.smapiot.com/en/imprint/" className="imprint" target="_blank">
            Imprint
          </a>
        </div>
        <div className="col-md-6 align-self-center text-center text-md-right my-2 social-media">
          <IconLink href="https://smapiot.com" logo="fas fa-globe" />
          <IconLink href="https://github.com/smapiot" logo="fab fa-github" />
          <IconLink href="https://twitter.com/smapiot" logo="fab fa-twitter" />
        </div>
      </div>
    </div>
  </div>
);
