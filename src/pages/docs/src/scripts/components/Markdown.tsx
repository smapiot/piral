import * as React from 'react';

export interface MarkdownProps {
  content: string;
  link?: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ content, link }) => (
  <>
    <div className="markdown-body" dangerouslySetInnerHTML={{ __html: content }} />
    {link && (
      <div className="markdown-edit">
        <a href={link} target="_blank" rel="noopener">
          <i className="fas fa-pen" /> Edit on GitHub
        </a>
      </div>
    )}
  </>
);
