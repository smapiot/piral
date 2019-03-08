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
const Empty: React.SFC = () => null;
const Heading: React.SFC = props => <h3 {...props} />;
const Figure: React.SFC<any> = props => <img {...props} className="responsive-image" src={imgRef(props.src)} />;
const Code: React.SFC<any> = ({ className = '', children }) => (
  <CodeBox code={children} language={className.substr(5)} />
);

export const Md: React.SFC<MdProps> = ({ children, overrides }) => {
  return (
    <Markdown
      options={{
        overrides: {
          h1: Empty,
          h2: Heading,
          img: Figure,
          code: Code,
          ...overrides,
        },
      }}>
      {children}
    </Markdown>
  );
};
