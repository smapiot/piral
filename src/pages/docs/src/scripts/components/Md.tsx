import * as React from 'react';
import Markdown from 'markdown-to-jsx';
import { CodeBox } from './CodeBox';
import { imgRef } from './urls';

export interface MdProps {
  children: string;
  overrides?: {
    [key: string]: React.ComponentType<any>;
  };
}

//tslint:disable-next-line
const Empty: React.FC = () => null;
const Heading: React.FC = props => <h3 {...props} />;
const Figure: React.FC<any> = props => <img {...props} className="responsive-image" src={imgRef(props.src)} />;
const Code: React.FC<any> = ({ className = '', children }) => (
  <CodeBox code={children} language={className.substr(5)} />
);
const Table: React.FC = props => (
  <div className="table-responsive">
    <table {...props} className="table table-hover" />
  </div>
);

export const Md: React.FC<MdProps> = ({ children, overrides }) => {
  return (
    <Markdown
      options={{
        overrides: {
          h1: Empty,
          h2: Heading,
          img: Figure,
          table: Table,
          code: Code,
          ...overrides,
        },
      }}>
      {children}
    </Markdown>
  );
};
