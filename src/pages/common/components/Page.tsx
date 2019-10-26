import * as React from 'react';

export interface PageProps {
  title?: string;
  description?: string;
}

const meta = document.querySelector('meta[name="description"]');
const defaultDescription = meta.getAttribute('content');
const defaultTitle = document.title;

export const Page: React.FC<PageProps> = ({ title, description, children }) => {
  React.useEffect(() => {
    document.title = title || defaultTitle;
  }, [title]);
  React.useEffect(() => {
    meta.setAttribute('content', description || defaultDescription);
  }, [description]);
  return <>{children}</>;
};
