import 'prismjs';
import * as React from 'react';
import { useRef, useEffect } from 'react';
import { cn } from './utils';

declare global {
  const Prism: {
    highlightElement(node: Element, async?: boolean): void;
  };
}

export interface CodeBoxProps {
  async?: boolean;
  code: string;
  language?: string;
}

export const CodeBox: React.SFC<CodeBoxProps> = ({ async, code, language }) => {
  const container = useRef(null);
  useEffect(() => {
    Prism.highlightElement(container.current, async);
  });
  return (
    <code ref={container} className={cn(language && `language-${language}`)}>
      {code}
    </code>
  );
};
