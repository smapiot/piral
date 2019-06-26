import * as React from 'react';

export const Footer: React.FC = () => (
  <footer className="footer text-center">
    <div className="container">
      <small className="copyright">
        Designed with <i className="fas fa-heart" /> by{' '}
        <a href="https://themes.3rdwavemedia.com/" target="_blank">
          Xiaoying Riley
        </a>
      </small>
      {' | '}
      <small className="copyright">
        <a href="https://www.smapiot.com/en/imprint/" target="_blank">
          Imprint
        </a>
      </small>
    </div>
  </footer>
);
