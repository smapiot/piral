import * as React from 'react';

export interface BreadcrumbsProps {
  current: string;
}

export const Breadcrumbs: React.SFC<BreadcrumbsProps> = ({ current }) => (
  <ol className="breadcrumb">
    <li className="breadcrumb-item">
      <a href="/">Home</a>
    </li>
    <li className="breadcrumb-item active">{current}</li>
  </ol>
);
