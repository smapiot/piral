import * as React from 'react';

export interface PluginMetaProps {
  name: string;
  description: string;
  keywords: Array<string>;
  dependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  author: string;
  homepage: string;
  license: string;
}

export const PluginMeta: React.FC<PluginMetaProps> = ({ description, keywords, author, homepage, license }) => (
  <div>
    <b>Description:</b>
    <p>{description}</p>
    <b>Author:</b>
    <p>{author}</p>
    <b>Homepage:</b>
    <p>{homepage}</p>
    <b>License:</b>
    <p>{license}</p>
    <b>Keywords:</b>
    <ul className="keywords">
      {keywords.map(keyword => (
        <li key={keyword}>{keyword}</li>
      ))}
    </ul>
  </div>
);
