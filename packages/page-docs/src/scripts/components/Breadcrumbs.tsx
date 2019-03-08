import * as React from 'react';
import { Link } from 'react-router-dom';

export interface Breadcrumb {
  title: string;
  to: string;
}

export interface BreadcrumbsProps {
  current: string;
  intermediate?: Array<Breadcrumb>;
}

export const Breadcrumbs: React.SFC<BreadcrumbsProps> = ({ current, intermediate = [] }) => (
  <ol className="breadcrumb">
    <li className="breadcrumb-item">
      <Link to="/">Home</Link>
    </li>
    {intermediate.map(item => (
      <li className="breadcrumb-item" key={item.to}>
        <Link to={item.to}>{item.title}</Link>
      </li>
    ))}
    <li className="breadcrumb-item active">{current}</li>
  </ol>
);
