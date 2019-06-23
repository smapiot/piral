import * as React from 'react';
import { Button } from './Button';

export interface DemoProps {
  title: string;
  appLink: string;
  codeLink: string;
}

export const Demo: React.SFC<DemoProps> = ({ title, appLink, codeLink, children }) => (
  <div className="col-lg-6 intro text-center">
    <h2>{title}</h2>
    {children}
    <div className="cta-container">
      <Button icon="link" href={appLink} target="_blank">
        Open Application
      </Button>
      <Button icon="code-branch" href={codeLink} target="_blank">
        View Code
      </Button>
    </div>
  </div>
);
