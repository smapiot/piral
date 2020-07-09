import * as React from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export interface SectionItem {
  title: string;
  links: Array<{
    id: string;
    title?: string;
    route: string;
  }>;
}

export interface SectionMenuProps {
  sections?: Array<SectionItem>;
  active: string;
}

export const SectionMenu: React.FC<SectionMenuProps> = ({ sections = [], active }) => {
  return (
    <Sidebar className="section-nav">
      {sections.map(section => (
        <React.Fragment key={section.title}>
          <div className="section-nav-title">{section.title}</div>
          <ul className="section-nav-list">
            {section.links.map(link => (
              <li key={link.id}>
                <Link className={active === link.route ? 'active' : ''} to={link.route}>
                  {link.title || link.id}
                </Link>
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </Sidebar>
  );
};
